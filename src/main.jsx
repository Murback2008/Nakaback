
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { TemaProvider } from "./context/TemaProvider";
import { MusicaProvider } from "./context/MusicaProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TemaProvider>
      <MusicaProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MusicaProvider>
    </TemaProvider>
  </React.StrictMode>
);
