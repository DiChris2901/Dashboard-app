import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ColorModeProvider } from "./contexts/ColorModeContext";
import { AuthProvider } from "./contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
<ColorModeProvider>
  <AuthProvider>
    <App />
  </AuthProvider>
</ColorModeProvider>

  </React.StrictMode>
);
