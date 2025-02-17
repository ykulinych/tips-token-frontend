import React from "react";
import { Transaction, TransactionType } from "../types/Transaction";
import { tokenOptions } from "../utils/options";

type TransactionItemProps = {
  transaction: Transaction;
};

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { createdAt, amount, token, type, sender, recipient } = transaction;

  const getTokenLabel = (tokenValue: string) => {
    const found = tokenOptions.find((t) => t.value === tokenValue);
    return found?.label || tokenValue;
  };

  return (
    <div className="flex w-full items-center p-2 border border-gray-200 rounded mb-2">
      <div className="w-1/3 text-left">{createdAt.toLocaleString()}</div>

      <div className="w-1/3 text-center">
        {type === TransactionType.TRANSFER && (
          <>
            <div>From: {sender}</div>
            <div>To: {recipient}</div>
          </>
        )}
      </div>

      <div className="w-1/3 text-right">
        {amount} {getTokenLabel(token)}
      </div>
    </div>
  );
};

export default TransactionItem;
