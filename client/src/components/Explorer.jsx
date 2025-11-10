import SongExplorer from "./SongExplorer";
import DocumentExplorer from "./DocumentExplorer";
import RecordingExplorer from "./RecordingExplorer";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const Explorer = ({ showExplorer, toggleExplorer }) => {
  return (
    <>
      <button className="explorer-toggle-btn" onClick={toggleExplorer}>
        {showExplorer ? <ChevronRightIcon /> : <MenuOpenIcon />}
      </button>
      <div className={`explorer ${showExplorer ? "explorer-visible" : ""}`}>
        <SongExplorer />
        <DocumentExplorer />
        <RecordingExplorer />
      </div>
    </>
  );
};

export default Explorer;
