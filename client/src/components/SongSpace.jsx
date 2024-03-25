import DocumentEditor from "./DocumentEditor";
import { DocumentsContextProvider } from "../context/DocumentsContext";

const SongSpace = () => {
  return (
    <div className="song-space">
        <DocumentEditor />
    </div>
  );
};

export default SongSpace;
