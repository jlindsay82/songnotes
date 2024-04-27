import { useState, useEffect, useContext } from "react";
import { useRecordingsContext } from "../hooks/useRecordingsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { OpenSongContext } from "../context/OpenSongContext";
import { config } from "../constants";

import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import DownloadIcon from '@mui/icons-material/Download';

const AudioRecorder = () => {
  //set state variables
  const [isRecording, setIsRecording] = useState(false);
  const [recordingNumber, setRecordingNumber] = useState(1);
  const [title, setTitle] = useState("");
  const [audioData, setAudioData] = useState(null);
  const [song_id, setSongId] = useState("");
  const [song_title, setSongTitle] = useState("");
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  //set contexts
  const { user } = useAuthContext();
  const { dispatch } = useRecordingsContext();
  const { openSong } = useContext(OpenSongContext);

  //set variables
  const fetchURL = config.url;

  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;

  //utility method
  let timer;
  const counter = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    if (openSong) {
      //console.log(openSong);
      setSongId(openSong._id);
      setSongTitle(openSong.title);
    }
  }, [openSong]);

  // use count function every second to display seconds elapsed during recording
  useEffect(() => {
    if (count) {
      timer = setTimeout(counter, 1000);
    }
    return () => clearTimeout(timer);
  }, [count]);

  //Render mediastream once for each recording re-rendered by an updated recordingNumber state variable
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

        // Start recording when the user clicks record button
        document
          .getElementById("startRecording")
          .addEventListener("click", function () {
            setError(null);
            console.log("handleStart was clicked");
            mediaRecorder.start();
            setIsRecording(true);
            counter();
          });

        // Stop recording when the user clicks stop button
        document
          .getElementById("stopRecording")
          .addEventListener("click", async function () {
            console.log("handleStop was clicked");
            mediaRecorder.stop();
            setIsRecording(false);
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
    //console.log("saveRecording was clicked");
    if (!user) {
      setError("You must be logged in.");
      return;
    }
    if(!song_id){
      setError("You must select a Song project before saving a recording.");
      return;
    }
    if (song_id) {
      const title = `${song_title}_${currentDate}_${recordingNumber}`;
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
        dispatch({ type: "CREATE_RECORDING", payload: json }); //update context to see new recording in RecordingExplorer component
      }
    }
  };

  // when the user clicks download button
  const handleDownload = () =>{
    const audioURL = document.getElementById("audioControl").src
    if(audioURL){
      console.log("clicked download");
      let hidden_a = document.createElement('a');
      hidden_a.href = audioURL;
      hidden_a.setAttribute('download', `${song_title}_${currentDate}_${recordingNumber}.wav`);
      document.body.appendChild(hidden_a);
      hidden_a.click();
    }
  };

  return (
    <div className="audio-section-container">
      <h4>Song Recorder{error && <div className="error">{error}</div>}</h4>
      <div className="recorder-controls-container">
        <div id="startRecording">
          <MicIcon />
        </div>
        <div id="stopRecording">
          <StopIcon />
        </div>
        <span className="recorder-timer">
          {`${Math.floor(count / 60)}`.padStart(2, 0)}:
          {`${count % 60}`.padStart(2, 0)}
        </span>
        <button id="saveRecording" className="save-button" onClick={handleSave}>
          Save
        </button>
      </div>
      <h4>Song Player</h4>
      <div className="audioplayer">
      <audio
        controls
        id="audioControl"
        title={`${song_title}_${currentDate}_${recordingNumber}`}
      ></audio>
      <div className="action-button" onClick={handleDownload} style={{marginTop:"8px"}}><DownloadIcon /></div>
      </div>
    </div>
  );
};

export default AudioRecorder;
