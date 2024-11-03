import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(1500); // Default 25 minutes in seconds
  const [timingType, setTimingType] = useState("SESSION");
  const [play, setPlay] = useState(false);

  // Function to format time as mm:ss
  const timeFormatter = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  };

  // Start/Stop the timer
  const handlePlay = () => setPlay((prev) => !prev);

  // Reset the clock to default values
  const handleReset = () => {
    setPlay(false); // Stop the timer
    setTimeLeft(1500); // Reset to 25:00
    setBreakLength(5); // Reset break length
    setSessionLength(25); // Reset session length
    setTimingType("SESSION"); // Reset timing type to SESSION

    const audio = document.getElementById("beep");
    if (audio) {
      audio.pause();
      audio.currentTime = 0; // Rewind audio
    }
  };

  // Transition between session and break
  const resetTimer = () => {
    const audio = document.getElementById("beep");
    if (timeLeft === 0) {
      if (timingType === "SESSION") {
        setTimeLeft(breakLength * 60);
        setTimingType("BREAK");
      } else {
        setTimeLeft(sessionLength * 60);
        setTimingType("SESSION");
      }
      if (audio) audio.play();
    }
  };

  useEffect(() => {
    if (play && timeLeft > 0) {
      const timeout = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timeout);
    } else if (timeLeft === 0) {
      resetTimer();
    }
  }, [play, timeLeft]);

  // Break increment and decrement
  const handleBreakChange = (amount) => {
    if (!play && breakLength + amount > 0 && breakLength + amount <= 60) {
      setBreakLength((prev) => prev + amount);
      if (timingType === "BREAK") {
        setTimeLeft((breakLength + amount) * 60);
      }
    }
  };

  // Session increment and decrement
  const handleSessionChange = (amount) => {
    if (!play && sessionLength + amount > 0 && sessionLength + amount <= 60) {
      setSessionLength((prev) => prev + amount);
      if (timingType === "SESSION") {
        setTimeLeft((sessionLength + amount) * 60);
      }
    }
  };

  return (
    <div id="app">
      <h1>25 + 5 Clock</h1>

      {/* Break Controls */}
      <div id="break">
        <h2 id="break-label">Break Length</h2>
        <button
          id="break-decrement"
          onClick={() => handleBreakChange(-1)}
          aria-label="Decrease break length"
        >
          -
        </button>
        <span id="break-length">{breakLength}</span>
        <button
          id="break-increment"
          onClick={() => handleBreakChange(1)}
          aria-label="Increase break length"
        >
          +
        </button>
      </div>

      {/* Session Controls */}
      <div id="session">
        <h2 id="session-label">Session Length</h2>
        <button
          id="session-decrement"
          onClick={() => handleSessionChange(-1)}
          aria-label="Decrease session length"
        >
          -
        </button>
        <span id="session-length">{sessionLength}</span>
        <button
          id="session-increment"
          onClick={() => handleSessionChange(1)}
          aria-label="Increase session length"
        >
          +
        </button>
      </div>

      {/* Timer Display */}
      <div id="timer">
        <h2 id="timer-label">{timingType}</h2>
        <div id="time-left">{timeFormatter()}</div>
      </div>

      {/* Controls */}
      <div id="controls">
        <button
          id="start_stop"
          onClick={handlePlay}
          aria-label="Start or stop timer"
        >
          {play ? "Pause" : "Start"}
        </button>
        <button id="reset" onClick={handleReset} aria-label="Reset timer">
          Reset
        </button>
      </div>

      {/* Audio Element */}
      <audio
        id="beep"
        preload="auto"
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
};

export default App;
