import { useState, useEffect } from "react";
import DocumentEditor from "./DocumentEditor";
import AudioRecorder from "../components/AudioRecorder";

const SongSpace = () => {
  const [openSongTitle, setOpenSongTitle] = useState("");

  useEffect(() => {
    if (JSON.parse(sessionStorage.getItem("openSong"))) {
      setOpenSongTitle(JSON.parse(sessionStorage.getItem("openSong")).title);
    }
  }, [openSongTitle]);

  return (
    <div className="song-space">
      <h3>
        Song Title:
        {openSongTitle && <span className="smaller"> {openSongTitle}</span>}
      </h3>
      <DocumentEditor />
      <AudioRecorder />
    </div>
  );
};

export default SongSpace;
