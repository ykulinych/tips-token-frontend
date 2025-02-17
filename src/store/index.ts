import { configureStore } from "@reduxjs/toolkit";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const store = configureStore({
  reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
