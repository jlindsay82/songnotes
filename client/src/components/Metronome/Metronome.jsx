import { useState, useRef, useEffect } from "react";
import "./metronome.css";

const audio1 = new Audio("./samples/click1-high.wav");
const audio2 = new Audio("./samples/click1-low.wav");
const minBpm = 10;
const maxBpm = 240;

// ...existing code...

const Metronome = () => {
  const timerIdRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);

  useEffect(() => {
    if (isPlaying) {
      start();
      return () => stop();
    } else {
      stop();
    }
  }, [bpm, isPlaying]);

  const handleStartStop = () => {
    setIsPlaying((prev) => !prev);
  };

  const start = () => {
    const interval = 60000 / bpm;
    timerIdRef.current = setInterval(() => {
      audio2.pause();
      audio2.currentTime = 0;
      audio2.play().catch((e) => {
        console.log(`Error playing audio: ${e}`);
      });
    }, interval);
    console.log(`Metronome is playing at ${bpm} BPM`);
  };

  const stop = () => {
    clearInterval(timerIdRef.current);
    console.log("Metronome has stopped");
  };

  const handleBpmChange = (e) => {
    setBpm(Number(e.target.value));
  };

  return (
    <>
      <p>Metronome</p>
      <button className={"play-button"} onClick={handleStartStop}>
        {isPlaying ? "Stop" : "Start"}
      </button>
      <label htmlFor="bpm">BPM</label>
      <input
        type="number"
        id="bpm"
        name="bpm"
        min={minBpm}
        max={maxBpm}
        value={bpm}
        onChange={handleBpmChange}
      ></input>
    </>
  );
};

export default Metronome;
