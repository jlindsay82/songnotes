import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useRecordingsContext } from "../hooks/useRecordingsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { OpenSongContext } from "../context/OpenSongContext";
import { config } from "../constants";
import Metronome from "./Metronome/Metronome";
import { getCurrentDateString } from "../utils/utils";

import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import DownloadIcon from "@mui/icons-material/Download";
import SaveIcon from "@mui/icons-material/Save";

const AudioRecorder = () => {
  // State variables
  const [isRecording, setIsRecording] = useState(false);
  const [recordingNumber, setRecordingNumber] = useState(1);
  const [audioData, setAudioData] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [song_id, setSongId] = useState("");
  const [song_title, setSongTitle] = useState("");
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isRecorderReady, setIsRecorderReady] = useState(false);

  // Contexts
  const { user } = useAuthContext();
  const { dispatch } = useRecordingsContext();
  const { openSong } = useContext(OpenSongContext);

  // Refs
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioBlobUrlRef = useRef(null);

  // Update song info when openSong changes
  useEffect(() => {
    if (openSong) {
      setSongId(openSong._id);
      setSongTitle(openSong.title);
    }
  }, [openSong]);

  // Timer effect - increment count every second while recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setCount((prevCount) => prevCount + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  // Initialize MediaRecorder once on mount
  useEffect(() => {
    const constraints = {
      audio: {
        channelCount: 1,
        noiseSuppression: false,
      },
      video: false,
    };

    let mounted = true;

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (!mounted) {
          // Component unmounted before permission granted
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        const mimeTypeOption = "audio/webm";
        const options = {
          audioBitsPerSecond: 320000,
          mimeType: mimeTypeOption,
        };

        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;
        setIsRecorderReady(true); // Trigger re-render to enable button

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });

          // Revoke previous blob URL to prevent memory leak
          if (audioBlobUrlRef.current) {
            URL.revokeObjectURL(audioBlobUrlRef.current);
          }

          const blobUrl = URL.createObjectURL(blob);
          audioBlobUrlRef.current = blobUrl;

          setAudioBlob(blob);
          setAudioData(blobUrl);

          if (audioRef.current) {
            audioRef.current.src = blobUrl;
            audioRef.current.load();
          }

          // Clear chunks for next recording
          chunksRef.current = [];
        };
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
        setError("Unable to access microphone. Please check permissions.");
      });

    // Cleanup on unmount
    return () => {
      mounted = false;

      // Stop media recorder if recording
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }

      // Stop all media tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Revoke blob URL
      if (audioBlobUrlRef.current) {
        URL.revokeObjectURL(audioBlobUrlRef.current);
      }

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []); // Only run once on mount

  // Start recording
  const handleStart = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "inactive"
    ) {
      setError(null);
      chunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setCount(0);
    }
  }, []);

  // Stop recording
  const handleStop = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingNumber((prev) => prev + 1);
    }
  }, []);

  // Save recording
  const handleSave = useCallback(async () => {
    if (!user) {
      setError("You must be logged in.");
      return;
    }
    if (!song_id) {
      setError("You must select a Song project before saving a recording.");
      return;
    }
    if (!audioBlob) {
      setError("No recording to save. Please record audio first.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const currentDate = getCurrentDateString();
      const title = `${song_title}_${currentDate}_${recordingNumber}`;
      const formData = new FormData();

      formData.append("audioFile", audioBlob, `${title}.webm`);
      formData.append("title", title);
      formData.append("song_id", song_id);
      formData.append("duration", count);
      formData.append("data", audioData);

      const response = await fetch(`${config.url}/api/recordings/user/`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error || "Failed to save recording");
      } else {
        setError(null);
        console.log("New recording added:", json);
        dispatch({ type: "CREATE_RECORDING", payload: json });
      }
    } catch (error) {
      console.error("Save error:", error);
      setError("Failed to save recording. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [
    user,
    song_id,
    audioBlob,
    song_title,
    recordingNumber,
    count,
    audioData,
    dispatch,
  ]);

  // Download recording
  const handleDownload = () => {
    if (audioData) {
      const currentDate = getCurrentDateString();
      const link = document.createElement("a");
      link.href = audioData;
      link.download = `${song_title}_${currentDate}_${recordingNumber}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="audio-section-container">
      <h4>
        Song Recorder
        {error && <div className="error">{error}</div>}
      </h4>
      <div className="recorder-controls-container">
        <button
          type="button"
          onClick={handleStart}
          disabled={isRecording || !isRecorderReady}
          aria-label="Start recording"
          style={{
            background: "none",
            color: "red",
            border: "none",
            cursor: isRecording || !isRecorderReady ? "not-allowed" : "pointer",
            opacity: isRecording || !isRecorderReady ? 0.5 : 1,
          }}
        >
          <MicIcon />
        </button>
        <button
          type="button"
          onClick={handleStop}
          disabled={!isRecording}
          aria-label="Stop recording"
          style={{
            background: "none",
            border: "none",
            cursor: !isRecording ? "not-allowed" : "pointer",
            opacity: !isRecording ? 0.5 : 1,
          }}
        >
          <StopIcon />
        </button>
        <span className="recorder-timer" aria-live="polite">
          {`${Math.floor(count / 60)}`.padStart(2, "0")}:
          {`${count % 60}`.padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !audioBlob}
          aria-label={isSaving ? "Saving..." : "Save recording"}
          className="save-recording-button"
          style={{
            background: "none",
            border: "none",
            cursor: isSaving || !audioBlob ? "not-allowed" : "pointer",
            opacity: isSaving || !audioBlob ? 0.5 : 1,
          }}
        >
          {isSaving ? "Saving..." : <SaveIcon sx={{ color: "#ffc400" }} />}
        </button>

        <span>|</span>
        <Metronome />
      </div>
      <h4>Song Player</h4>
      <div className="audioplayer">
        <audio
          ref={audioRef}
          controls
          id="audioControl"
          title={`${song_title}_${getCurrentDateString()}_${recordingNumber}`}
        />
        <button
          type="button"
          className="action-button"
          onClick={handleDownload}
          disabled={!audioData}
          aria-label="Download recording"
          style={{
            marginTop: "8px",
            cursor: !audioData ? "not-allowed" : "pointer",
            opacity: !audioData ? 0.5 : 1,
          }}
        >
          <DownloadIcon />
        </button>
      </div>
    </div>
  );
};

export default AudioRecorder;
