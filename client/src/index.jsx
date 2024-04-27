import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext";
import { SongsContextProvider } from "./context/SongsContext";
import { DocumentsContextProvider } from "./context/DocumentsContext";
import { EditorContextProvider } from "./context/EditorContext";
import { RecordingsContextProvider } from "./context/RecordingsContext";
import { OpenSongContextProvider } from "./context/OpenSongContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <SongsContextProvider>
        <DocumentsContextProvider>
          <EditorContextProvider>
            <RecordingsContextProvider>
              <OpenSongContextProvider>
                <App />
              </OpenSongContextProvider>
            </RecordingsContextProvider>
          </EditorContextProvider>
        </DocumentsContextProvider>
      </SongsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
