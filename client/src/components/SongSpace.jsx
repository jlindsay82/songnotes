import { useState, useEffect } from "react";
import DocumentEditor from "./DocumentEditor";
import AudioRecorder from "../components/AudioRecorder";
import { OpenSongContext } from "../context/OpenSongContext";
import { useContext } from "react";

const SongSpace = () => {
  const [openSongTitle, setOpenSongTitle] = useState("");

  //set variables
  const { openSong } = useContext(OpenSongContext);

  useEffect(() => {
    //console.log(openSong);
    if (openSong) {
      setOpenSongTitle(openSong.title);
    }
  }, [openSong]);

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
