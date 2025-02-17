import React from "react";
import { Transaction } from "../types/Transaction";
import TransactionItem from "./TransactionItem";

type TransactionListProps = {
  transactions: Transaction[];
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <div className="w-full flex flex-col space-y-2">
      {transactions.map((tx) => (
        <TransactionItem key={tx.id} transaction={tx} />
      ))}
    </div>
  );
};

export default TransactionList;
