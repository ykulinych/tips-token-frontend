// @note: temporary solution. put all DTOs into shared package

import { TransactionType } from "../../types/Transaction";

export type SaveTransactionDto = {
  sender: string;
  recipient: string;
  amount: number;
  token: string;
  type?: TransactionType;
};

export type GetTransactionsDto = {
  wallet: string;
  type?: TransactionType;
};

export type AirdropDto = {
  recipientAddress: string;
};
