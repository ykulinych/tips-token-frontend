import React, { useEffect, useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { Form, Formik, FormikHelpers } from "formik";
import { CreateTransactionSchema } from "../../schemas/transfer";
import { tokenOptions } from "../../utils/options";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  saveTransaction,
  selectTransactions,
  updateQuery,
} from "../../features/main";
import { TransactionType } from "../../types/Transaction";
import * as anchor from "@coral-xyz/anchor";
import {
  getAssociatedTokenAddress,
  getMint,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import idl from "../../../../tips-token/target/idl/tipstoken.json"; // @note: same problem with path on backend
import toast from "react-hot-toast";

import TransactionList from "../TransactionList";

const TransferTab: React.FC = () => {
  const wallet = useWallet();
  const walletAddress = useMemo(() => {
    return wallet.publicKey!.toBase58();
  }, [wallet.publicKey]);
  const dispatch = useAppDispatch();
  const { connection } = useConnection();

  const transactions = useAppSelector(selectTransactions);

  useEffect(() => {
    dispatch(
      updateQuery({
        wallet: walletAddress,
        type: TransactionType.TRANSFER,
      })
    );

    return () => {
      dispatch(updateQuery(null));
    };
  }, []);

  const initialValues = {
    recipient: "",
    amount: 0,
    token: tokenOptions[0].value,
  };

  const transferSol = async (amount: number, recipient: string) => {
    const lamports = amount * LAMPORTS_PER_SOL;
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey!,
        toPubkey: new PublicKey(recipient),
        lamports,
      })
    );

    await wallet.sendTransaction(tx, connection);
  };

  const transferSplToken = async (amount: number, recipient: string) => {
    const provider = new anchor.AnchorProvider(
      connection,
      wallet as unknown as anchor.Wallet,
      {
        preflightCommitment: "processed",
      }
    );
    const program = new anchor.Program(idl as anchor.Idl, provider);
    const tokenMint = new PublicKey(import.meta.env.VITE_TIPS_TOKEN_MINT);
    const { decimals } = await getMint(connection, tokenMint);

    // todo: move to shared
    const amountDecimalBN = new anchor.BN(amount).mul(
      new anchor.BN(10).pow(new anchor.BN(decimals))
    );

    const fromTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      wallet.publicKey!
    );
    const recipientPubKey = new PublicKey(recipient);
    const toTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      recipientPubKey
    );

    await program.methods
      .transfer(amountDecimalBN)
      .accounts({
        from: fromTokenAccount,
        to: toTokenAccount,
        authority: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    const { recipient, amount, token } = values;
    try {
      if (token === "sol") {
        await toast.promise(transferSol(amount, recipient), {
          loading: "Transferring SOL...",
          success: "SOL transferred successfully!",
          error: "Failed to transfer SOL.",
        });
      } else {
        await toast.promise(transferSplToken(amount, recipient), {
          loading: "Transferring SPL Token...",
          success: "SPL Token transferred successfully!",
          error: "Failed to transfer SPL Token.",
        });
      }

      await dispatch(
        saveTransaction({ sender: walletAddress, recipient, amount, token })
      ).unwrap();
      toast.success("Transaction saved successfully!");
    } catch {
      toast.error("Error when performing transfer");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={CreateTransactionSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Form className="flex flex-col space-y-4 m-6">
            <div>
              <input
                id="recipient"
                name="recipient"
                type="text"
                placeholder="Recipient Address..."
                className="w-full p-2 border border-gray-300 rounded"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.recipient}
              />
              {errors.recipient && touched.recipient && (
                <p className="text-red-500 text-sm mt-1">{errors.recipient}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  id="amount"
                  name="amount"
                  type="text"
                  placeholder="Amount..."
                  className="w-full p-2 border border-gray-300 rounded"
                  value={values.amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.amount && errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>
              <div className="flex-1">
                <select
                  id="token"
                  name="token"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={values.token}
                  onChange={handleChange}
                >
                  {tokenOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* todo: create ui components like button, input etc */}
            <button
              type="submit"
              className="bg-violet-700 text-white rounded py-2 hover:bg-violet-600 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Transfer
            </button>
          </Form>
        )}
      </Formik>

      <hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-700" />

      <div className="w-full px-8">
        <h3 className="text-lg font-bold mb-2 text-center">
          Transaction History
        </h3>
        <TransactionList transactions={transactions} />
      </div>
    </>
  );
};

export default TransferTab;
