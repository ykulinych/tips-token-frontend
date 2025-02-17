import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./reset.css";
import { Provider } from "react-redux";
import store from "./store";
import { SolanaProvider } from "./components/solana/SolanaProvider.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <SolanaProvider>
        <App />
      </SolanaProvider>
    </Provider>
  </StrictMode>
);
