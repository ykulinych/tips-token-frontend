// @note: temporary slice. need to rename and split logic

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AirdropDto, GetTransactionsDto, SaveTransactionDto } from "./dto";
import {
  getTransactions,
  saveTransaction as apiSaveTransaction,
  airdrop as apiAirdrop,
} from "./api";
import { Transaction } from "../../types/Transaction";
import { RootState } from "../../store";

type Balance = {
  sol: number;
  tipsToken: number;
};

interface MainState {
  balance: Balance;
  transactions: Transaction[];
  query: GetTransactionsDto | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: MainState = {
  balance: {
    sol: 0,
    tipsToken: 0,
  },
  transactions: [],
  query: null,
  status: "idle",
};

export const saveTransaction = createAsyncThunk(
  "main/saveTransaction",
  async (body: SaveTransactionDto) => {
    const response = await apiSaveTransaction(body);
    return response;
  }
);

export const fetchTransactions = createAsyncThunk(
  "main/fetchTransactions",
  async (_, thunkAPI) => {
    const rootState = thunkAPI.getState() as RootState;
    const query = rootState.main.query;
    if (!query) return [];

    const response = getTransactions(query);
    return response;
  }
);

export const airdrop = createAsyncThunk(
  "main/airdrop",
  async (body: AirdropDto) => {
    const response = await apiAirdrop(body);
    return response;
  }
);

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    updateQuery(state, action: PayloadAction<GetTransactionsDto | null>) {
      state.query = action.payload;
    },
    updateBalance(state, action: PayloadAction<Partial<Balance>>) {
      state.balance = {
        ...state.balance,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(saveTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transactions.unshift(action.payload);
      })
      .addCase(saveTransaction.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(airdrop.pending, (state) => {
        state.status = "loading";
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .addCase(airdrop.fulfilled, (state, _action) => {
        state.status = "succeeded";
      })
      .addCase(airdrop.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { updateQuery, updateBalance } = mainSlice.actions;
export default mainSlice.reducer;
