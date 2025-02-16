import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import Navbar from "./components/Navbar";
import Tabs, { Tab } from "./components/tabs/Tabs";
import BalanceTab from "./components/tabs/BalanceTab";
import TransferTab from "./components/tabs/TransferTab";

type TabKey = "balance" | "transfer";

const App: React.FC = () => {
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState<TabKey>("balance");

  const tabItems: Tab<TabKey>[] = [
    { key: "balance", label: "Balance" },
    { key: "transfer", label: "Transfer" },
  ];

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
          {activeTab === "balance" && <BalanceTab />}
          {activeTab === "transfer" && <TransferTab />}
        </div>
      )}
    </div>
  );
};

export default App;
