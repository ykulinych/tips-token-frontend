import { RootState } from "../../store";

export const selectBalance = (state: RootState) => state.main.balance;
export const selectTransactions = (state: RootState) => state.main.transactions;
export const selectStatus = (state: RootState) => state.main.status;
export const selectQuery = (state: RootState) => state.main.query;
