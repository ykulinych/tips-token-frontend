import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { fetchTransactions, selectQuery } from "./features/main";

import Navbar from "./components/Navbar";
import Tabs, { Tab } from "./components/tabs/Tabs";
import BalanceTab from "./components/tabs/BalanceTab";
import TransferTab from "./components/tabs/TransferTab";

type TabKey = "balance" | "transfer";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState<TabKey>("balance");

  const tabItems: Tab<TabKey>[] = [
    { key: "balance", label: "Balance" },
    { key: "transfer", label: "Transfer" },
  ];

  const query = useAppSelector(selectQuery);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch, query]);

  return (
    <div className="h-full flex flex-col">
      <Navbar />

      {wallet.connected && (
        <div className="flex flex-col flex-1 items-center justify-center">
          <Tabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabItems}
          />

          <div className="mt-4 w-full max-w-6xl bg-zinc-100 rounded-xl">
            {activeTab === "balance" && <BalanceTab />}
            {activeTab === "transfer" && <TransferTab />}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
