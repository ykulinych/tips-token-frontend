import api from "../../api/api";
import { Transaction } from "../../types/Transaction";
import { AirdropDto, GetTransactionsDto, SaveTransactionDto } from "./dto";

export const saveTransaction = async (
  body: SaveTransactionDto
): Promise<Transaction> => {
  const response = await api.post("/transaction", body);
  return response.data;
};

export const getTransactions = async (
  query: GetTransactionsDto
): Promise<Transaction[]> => {
  const response = await api.get("/transaction", {
    params: query,
  });
  return response.data;
};

export const airdrop = async (body: AirdropDto): Promise<{ tx: string }> => {
  const response = await api.post("/tips-token/airdrop", body);
  return response.data;
};
