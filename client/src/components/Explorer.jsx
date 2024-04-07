import SongExplorer from "./SongExplorer";
import DocumentExplorer from "./DocumentExplorer";
import RecordingExplorer from "./RecordingExplorer";

const Explorer = () => {
  return (
    <div className="explorer">
      <SongExplorer />
      <DocumentExplorer />
      <RecordingExplorer />
    </div>
  );
};

export default Explorer;
