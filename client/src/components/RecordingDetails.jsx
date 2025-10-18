import { useContext } from "react";
import { useRecordingsContext } from "../hooks/useRecordingsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { config } from "../constants";
import DeleteIcon from "@mui/icons-material/Delete";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useState } from "react";

const RecordingDetails = ({ recording }) => {
  //set contexts
  const { dispatch } = useRecordingsContext();
  const { user } = useAuthContext();

  //set state for playback
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  //set variables
  const URL = config.url;

  //set handlers
  const handleSelect = async () => {
    if (!user) {
      return;
    }
    //console.log(`recording ${recording.title} was selected`);
    const response = await fetch(
      URL + "/api/recordings/recording/" + recording._id,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();

    if (response.ok) {
      console.log("recording selected:", json);
      sessionStorage.setItem("openRecording", JSON.stringify(json)); //set selected recording as current open recording
    }
  };

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    const response = await fetch(
      URL + "/api/recordings/recording/" + recording._id,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_RECORDING", payload: json });
      console.log("recording deleted:", json);
      //if deleted recording is the open recording, then this should be cleared from local storage
      if (
        JSON.parse(sessionStorage.getItem("openRecording")) &&
        JSON.parse(sessionStorage.getItem("openRecording"))._id === json._id
      ) {
        //console.log("deleted recording is same id as openRecording");
        sessionStorage.removeItem("openRecording");
      }
    }
  };

  const handlePlayPause = async () => {
    if (!user) {
      return;
    }

    try {
      if (!audioElement) {
        // Fetch audio file with authentication
        const response = await fetch(
          `${URL}/api/recordings/audio/${recording._id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch audio:", response.status);
          return;
        }

        // Convert response to blob and create object URL
        const blob = await response.blob();
        console.log("Blob created:", blob.size, blob.type);
        const blobUrl = window.URL.createObjectURL(blob);
        console.log("Blob URL created:", blobUrl);

        // Create new audio element for this recording
        const audio = new Audio(blobUrl);

        // Add event listeners
        audio.addEventListener("ended", () => {
          setIsPlaying(false);
          window.URL.revokeObjectURL(blobUrl); // Clean up blob URL
        });

        audio.addEventListener("error", (e) => {
          console.error("Audio playback error:", e);
          setIsPlaying(false);
          window.URL.revokeObjectURL(blobUrl); // Clean up blob URL
        });

        audio.addEventListener("loadeddata", () => {
          console.log("Audio loaded successfully, duration:", audio.duration);
        });

        setAudioElement(audio);
        console.log("Attempting to play audio...");
        await audio.play();
        console.log("Audio playing!");
        setIsPlaying(true);
      } else {
        // Toggle play/pause on existing audio element
        if (isPlaying) {
          audioElement.pause();
          setIsPlaying(false);
        } else {
          await audioElement.play();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error("Playback error:", error);
      setIsPlaying(false);
    }
  };

  return (
    <div className="explorer-item">
      <h4>{recording.title}</h4>
      {(recording.filePath || recording.data) && (
        <span className={`action tooltip`} onClick={handlePlayPause}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          <span className="tooltiptext">
            {isPlaying ? "Pause" : "Play"} recording
          </span>
        </span>
      )}
      <span className={`action tooltip`} onClick={handleDelete}>
        <DeleteIcon />
        <span className="tooltiptext">Delete recording</span>
      </span>
    </div>
  );
};

export default RecordingDetails;
