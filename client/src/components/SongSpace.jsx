import { useState, useEffect } from "react";
import DocumentEditor from "./DocumentEditor";
import AudioRecorder from "../components/AudioRecorder";
import Toast from "./Toast";
import { OpenSongContext } from "../context/OpenSongContext";
import { useContext } from "react";

const SongSpace = () => {
  const [openSongTitle, setOpenSongTitle] = useState("");

  //set variables
  const { openSong } = useContext(OpenSongContext);
  const welcomeMessage = "Welcome to your dashboard - Let's write a hit!";

  useEffect(() => {
    //console.log(openSong);
    if (openSong) {
      setOpenSongTitle(openSong.title);
    }
  }, [openSong]);

  return (
    <div className="song-space">
      <h2 className="song-header">
        {openSongTitle && <span> {openSongTitle}</span>}
      </h2>
      <Toast display={true} message={welcomeMessage} />
      <DocumentEditor />
    </div>
  );
};

export default SongSpace;
