import React, { useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { TransactionType } from "../../types/Transaction";
import {
  airdrop,
  selectBalance,
  selectTransactions,
  updateQuery,
} from "../../features/main";

import TransactionList from "../TransactionList";

const BalanceTab: React.FC = () => {
  const wallet = useWallet();
  const walletAddress = useMemo(() => {
    return wallet.publicKey!.toBase58();
  }, [wallet.publicKey]);
  const dispatch = useAppDispatch();

  const balance = useAppSelector(selectBalance);
  const transactions = useAppSelector(selectTransactions);
  const [loadingAirdrop, setLoadingAirdrop] = useState<boolean>(false);

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

  const handleAirdrop = () => {
    try {
      setLoadingAirdrop(true);
      dispatch(airdrop({ recipientAddress: walletAddress })).unwrap();
      // todo: update backend airdrop endpoint. needed amount & transaction
    } catch (error) {
      // todo: hanbdle error
      console.log(error);
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
          {loadingAirdrop ? "Airdrop in progress..." : "Tips Airdrop"}
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
