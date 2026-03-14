import { useState, useRef, useEffect } from "react";
import "./metronome.css";

const minBpm = 10;
const maxBpm = 240;

// ...existing code...

const Metronome = () => {
  const audioContextRef = useRef(null);
  const clickBufferRef = useRef(null);
  const nextNoteTimeRef = useRef(0);
  const schedulerIdRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);

  // Initialize AudioContext and load audio file
  useEffect(() => {
    const initAudio = async () => {
      // Create AudioContext
      audioContextRef.current = new (
        window.AudioContext || window.webkitAudioContext
      )();

      try {
        // Fetch and decode the click sound
        const response = await fetch("./samples/click1-low.wav");
        const arrayBuffer = await response.arrayBuffer();
        clickBufferRef.current =
          await audioContextRef.current.decodeAudioData(arrayBuffer);
        console.log("Metronome audio loaded successfully");
      } catch (error) {
        console.error("Error loading metronome audio:", error);
      }
    };

    initAudio();

    // Cleanup on unmount
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const scheduleAheadTime = 0.1; // How far ahead to schedule (100ms)
    const scheduleInterval = 25; // How often to check (25ms)

    // Play a single click at a specific time
    const scheduleNote = (time) => {
      if (!audioContextRef.current || !clickBufferRef.current) return;

      const source = audioContextRef.current.createBufferSource();
      source.buffer = clickBufferRef.current;
      source.connect(audioContextRef.current.destination);
      source.start(time); // Start at precise audio context time
    };

    // Look ahead and schedule notes that need to play soon
    const scheduler = () => {
      if (!audioContextRef.current) return;

      const currentTime = audioContextRef.current.currentTime;
      const secondsPerBeat = 60.0 / bpm;

      // Schedule all notes that will play in the next 100ms
      while (nextNoteTimeRef.current < currentTime + scheduleAheadTime) {
        scheduleNote(nextNoteTimeRef.current);
        nextNoteTimeRef.current += secondsPerBeat;
      }

      // Check again in 25ms
      schedulerIdRef.current = setTimeout(scheduler, scheduleInterval);
    };

    const start = () => {
      if (!audioContextRef.current) return;

      // Initialize the next note time to now
      nextNoteTimeRef.current = audioContextRef.current.currentTime;
      scheduler(); // Start the scheduler
      console.log(`Metronome is playing at ${bpm} BPM`);
    };

    const stop = () => {
      if (schedulerIdRef.current) {
        clearTimeout(schedulerIdRef.current);
        schedulerIdRef.current = null;
      }
      console.log("Metronome has stopped");
    };

    if (isPlaying && bpm > 0) {
      start();
      return () => stop();
    } else {
      stop();
    }
  }, [bpm, isPlaying]);

  const handleStartStop = () => {
    setIsPlaying((prev) => !prev);
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
