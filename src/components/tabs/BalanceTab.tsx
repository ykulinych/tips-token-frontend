import React, { useState } from "react";
import { Transaction, TransactionType } from "../../types/Transaction";
import TransactionList from "../TransactionList";

const BalanceTab: React.FC = () => {
  const [solBalance, setSolBalance] = useState<number>(1.234);
  const [tipsBalance, setTipsBalance] = useState<number>(100);
  const [loadingAirdrop, setLoadingAirdrop] = useState<boolean>(false);

  // @note: mocked
  const handleAirdrop = () => {
    // todo: impement request to backend
    setLoadingAirdrop(true);
    setTimeout(() => {
      setTipsBalance((prev) => prev + 50);
      setLoadingAirdrop(false);
    }, 1000);
  };

  const mockTransactions: Transaction[] = [
    {
      id: "1",
      type: TransactionType.AIRDROP,
      sender: "fake-sender",
      recipient: "fake-recipient",
      amount: 50,
      token: "tips-token",
      createdAt: new Date("2024-02-15T13:13:13"),
    },
    {
      id: "2",
      type: TransactionType.AIRDROP,
      sender: "fake-sender",
      recipient: "fake-recipient",
      amount: 50,
      token: "tips-token",
      createdAt: new Date("2024-02-15T12:12:12"),
    },
  ];

  return (
    <>
      <div className="flex w-full justify-around items-center my-2">
        <div className="text-center">
          <p className="text-2xl">
            SOL: <span className="font-semibold">{solBalance.toFixed(3)}</span>
          </p>
        </div>

        <div className="text-center">
          <p className="text-2xl">
            TipsToken:{" "}
            <span className="font-semibold">{tipsBalance.toFixed(3)}</span>
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
        <TransactionList transactions={mockTransactions} />
      </div>
    </>
  );
};

export default BalanceTab;
