import React from "react";
import { SolanaProvider } from "./components/solana/SolanaProvider";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  return (
    <SolanaProvider>
      <div className="h-full flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          TODO: tabs
        </div>
      </div>
    </SolanaProvider>
  );
};

export default App;
