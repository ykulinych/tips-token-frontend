import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./reset.css";
import { SolanaProvider } from "./components/solana/SolanaProvider.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SolanaProvider>
      <App />
    </SolanaProvider>
  </StrictMode>
);
