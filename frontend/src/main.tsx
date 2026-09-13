import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ThemeModeProvider } from "./context/ThemeModeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeModeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { fontFamily: "Inter, sans-serif" },
            }}
          />
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ThemeModeProvider>
  </StrictMode>
);
