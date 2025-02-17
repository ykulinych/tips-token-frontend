export enum TransactionType {
  TRANSFER = "TRANSFER",
  AIRDROP = "AIRDROP",
}

export type Transaction = {
  id: string;
  type: TransactionType;
  sender: string;
  recipient: string;
  amount: number;
  token: string;
  createdAt: Date;
};
