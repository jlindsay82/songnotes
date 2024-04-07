import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { SongsContextProvider } from "./context/SongsContext";
import { AuthContextProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <SongsContextProvider>
        <App />
      </SongsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
