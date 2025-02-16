import React from "react";
import { WalletButton } from "./solana/SolanaProvider";

const Navbar: React.FC = () => {
  return (
    <div className="navbar flex">
      <div className="flex-1">
        <h1 className="text-3xl font-bold underline">TipsToken</h1>
      </div>
      <div className="flex-none space-x-2">
        <WalletButton />
      </div>
    </div>
  );
};

export default Navbar;
