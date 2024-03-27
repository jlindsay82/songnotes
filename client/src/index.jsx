import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext";
import { SongsContextProvider } from "./context/SongsContext";
import { DocumentsContextProvider } from "./context/DocumentsContext";
import { EditorContextProvider } from "./context/EditorContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <SongsContextProvider>
        <DocumentsContextProvider>
          <EditorContextProvider>
            <App />
          </EditorContextProvider>
        </DocumentsContextProvider>
      </SongsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
