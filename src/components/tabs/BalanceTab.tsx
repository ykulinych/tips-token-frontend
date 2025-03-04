import React, { useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { TransactionType } from "../../types/Transaction";
import {
  airdrop,
  selectBalance,
  selectTransactions,
  updateBalance,
  updateQuery,
} from "../../features/main";
import toast from "react-hot-toast";

import TransactionList from "../TransactionList";

const BalanceTab: React.FC = () => {
  const { publicKey } = useWallet();
  const walletAddress = useMemo(() => {
    return publicKey!.toBase58();
  }, [publicKey]);
  const dispatch = useAppDispatch();
  const { connection } = useConnection();

  const balance = useAppSelector(selectBalance);
  const transactions = useAppSelector(selectTransactions);
  const [loadingAirdrop, setLoadingAirdrop] = useState<boolean>(false);

  const fetchAndUpdateSolBalance = async () => {
    const lamports = await connection.getBalance(publicKey!);
    const sol = lamports / LAMPORTS_PER_SOL;
    dispatch(updateBalance({ sol }));
  };

  const fetchAndUpdateTipstokenBalace = async () => {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey!,
      {
        mint: new PublicKey(import.meta.env.VITE_TIPS_TOKEN_MINT),
      }
    );

    const tokenAccountInfo = tokenAccounts.value[0].account.data.parsed.info;
    const uiAmount = tokenAccountInfo.tokenAmount.uiAmount;
    dispatch(updateBalance({ tipsToken: uiAmount || 0 }));
  };

  useEffect(() => {
    fetchAndUpdateSolBalance();
    fetchAndUpdateTipstokenBalace();

    return () => {
      dispatch(updateBalance({ sol: 0, tipsToken: 0 }));
    };
  }, [publicKey]);

  useEffect(() => {
    dispatch(
      updateQuery({
        wallet: walletAddress,
        type: TransactionType.AIRDROP,
      })
    );

    return () => {
      dispatch(updateQuery(null));
    };
  }, []);

  const handleAirdrop = async () => {
    try {
      setLoadingAirdrop(true);
      const airdropPromise = dispatch(
        airdrop({ recipientAddress: walletAddress })
      ).unwrap();
      await toast.promise(airdropPromise, {
        loading: "Airdrop...",
        success: "Airdrop was successful!",
        error: "Error when performing airdrop",
      });
      await fetchAndUpdateTipstokenBalace();
    } catch {
      toast.error("Error when performing airdrop");
    } finally {
      setLoadingAirdrop(false);
    }
  };

  return (
    <>
      <div className="flex w-full justify-around items-center my-2">
        <div className="text-center">
          <p className="text-2xl">
            SOL: <span className="font-semibold">{balance.sol.toFixed(3)}</span>
          </p>
        </div>

        <div className="text-center">
          <p className="text-2xl">
            TipsToken:{" "}
            <span className="font-semibold">
              {balance.tipsToken.toFixed(3)}
            </span>
          </p>
        </div>
      </div>

      <div className="w-full px-20">
        <button
          onClick={handleAirdrop}
          disabled={loadingAirdrop}
          className="w-full py-2 bg-violet-700 text-white rounded hover:bg-violet-600 transition-colors disabled:opacity-50 cursor-pointer"
        >
          Tips Airdrop
        </button>
      </div>

      <hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-700" />

      <div className="w-full px-8">
        <h3 className="text-lg font-bold mb-2 text-center">Airdrop History</h3>
        <TransactionList transactions={transactions} />
      </div>
    </>
  );
};

export default BalanceTab;
