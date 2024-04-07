import { useState, useEffect } from "react";
import { useRecordingsContext } from "../hooks/useRecordingsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { config } from "../constants";

import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";

const AudioRecorder = () => {
  //set state variables
  const [isRecording, setIsRecording] = useState(false);
  const [recordingNumber, setRecordingNumber] = useState(1);
  const [title, setTitle] = useState("");
  const [audioData, setAudioData] = useState(null);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  //set contexts
  const { user } = useAuthContext();
  const { dispatch } = useRecordingsContext();

  //set variables
  const fetchURL = config.url;

  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;

  let song_id = "";
  let song_title = "";
  if (JSON.parse(sessionStorage.getItem("openSong"))) {
    song_id = JSON.parse(sessionStorage.getItem("openSong"))._id;
    song_title = JSON.parse(sessionStorage.getItem("openSong")).title;
  }

  //utility method
  let timer;
  const counter = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    if (count) {
      timer = setTimeout(counter, 1000);
    }
    return () => clearTimeout(timer);
  }, [count]);

  //Render mediastream once for each recording
  useEffect(() => {
    // Get user's microphone stream
    const constraints = {
      audio: {
        channelCount: 1,
        noiseSuppression: false,
      },
      video: false,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        // set media options
        let mimeTypeOption = "audio/webm";
        const options = {
          audioBitsPerSecond: 320000,
          mimeType: mimeTypeOption,
        };

        // Create a MediaRecorder instance

        const mediaRecorder = new MediaRecorder(stream, options);
        let chunks = [];

        // Event handler when data is available
        mediaRecorder.ondataavailable = function (e) {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        // Event handler when recording is stopped
        mediaRecorder.onstop = function () {
          // Combine audio chunks into a Blob
          let blob = new Blob(chunks, { type: "audio/wav" });

          // Create a temporary URL for the Blob
          const blobUrl = URL.createObjectURL(blob);

          //capture blob content for server upload
          setAudioData(blobUrl);

          // Create an audio element
          const audioElement = document.getElementById("audioControl");

          // Set the source of the audio element to the Blob URL
          audioElement.src = blobUrl;

          // Play recorded audio back
          audioElement.controls;
          if (blobUrl) {
            audioElement.src = blobUrl;
            audioElement.setAttribute("controls", true);
            audioElement.load();
          }
        };

        // Start recording when the user clicks a button
        document
          .getElementById("startRecording")
          .addEventListener("click", function () {
            console.log("handleStart was clicked");
            mediaRecorder.start();
            setIsRecording(true);
            counter();
          });
        // });

        // Stop recording when the user clicks another button
        document
          .getElementById("stopRecording")
          .addEventListener("click", async function () {
            console.log("handleStop was clicked");
            mediaRecorder.stop();
            setIsRecording(false);
            const updatedTitle = `${song_title}_${currentDate}_${recordingNumber}`;
            setTitle(updatedTitle);
            setRecordingNumber(recordingNumber + 1);
            setCount(0);
            clearTimeout(timer);
          });
      })
      .catch(function (err) {
        console.error("Error accessing microphone:", err);
      });

    return;
  }, [recordingNumber]);

  const handleSave = async () => {
    console.log("saveRecording was clicked");
    if (!user) {
      setError("You must be logged in");
      return;
    }

    console.log(audioData);
    let data = audioData;
    // const reader = new FileReader();
    // reader.readAsArrayBuffer(audioData);
    // reader.onload = async function (event) {
    //   data = event.target.result;
    //console.log(data);
    // let formData = new FormData();
    // formData.append("title", title);
    // formData.append("data", audioData);
    // formData.append("song_id", song_id);
    const recording = { title, data, song_id };
    const response = await fetch(fetchURL + "/api/recordings/user/", {
      method: "POST",
      body: JSON.stringify(recording),
      //body: formData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setError(null);
      console.log("new recording added:", json);
      dispatch({ type: "CREATE_RECORDING", payload: json }); //update context to see new document in RecordingDetails component
    }
  };

  return (
    <div className="audioRecorder">
      <h4>Song Recorder/Player</h4>
      <div className="audio-controls-container">
        <div id="startRecording">
          <MicIcon />
        </div>
        <div id="stopRecording">
          <StopIcon />
        </div>
        <audio controls id="audioControl"></audio>
        <span>
          {`${Math.floor(count / 60)}`.padStart(2, 0)}:
          {`${count % 60}`.padStart(2, 0)}
        </span>
      </div>
      <p></p>
      <button id="saveRecording" className="save-button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default AudioRecorder;
