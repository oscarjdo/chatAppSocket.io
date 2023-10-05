import React, { useEffect, useRef } from "react";
import exactTime from "../../utils/exactTime";
import { FaPlay } from "react-icons/fa";
import { TiMediaPause } from "react-icons/ti";

function MultimediaTimerBar({ data }) {
  const {
    time,
    isPaused,
    duration,
    currentTime,
    fileRef,
    setIsPaused,
    setCurrentTime,
  } = data;

  const inputRef = useRef(null);

  const handlePause = async () => {
    if (isPaused) {
      fileRef.current.play();
      setIsPaused(false);
    } else {
      fileRef.current.pause();
      setIsPaused(true);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.backgroundSize =
        (inputRef.current.value * 100) / inputRef.current.max + "% 100%";
    }
  }, [currentTime, isPaused, duration]);

  return (
    <div className="multimedia-timer-bar">
      <button type="button" onClick={handlePause}>
        {isPaused ? (
          <FaPlay className="icon" />
        ) : (
          <TiMediaPause className="icon bigger" />
        )}
      </button>
      {time ? <p>{exactTime(currentTime, fileRef, true)}</p> : null}
      <input
        type="range"
        className="no-move"
        min={0}
        max={duration}
        value={currentTime}
        name=""
        ref={inputRef}
        onTouchStart={() => fileRef.current.pause()}
        onTouchEnd={() => {
          if (!isPaused) fileRef.current.play();
        }}
        onChange={(e) => {
          setCurrentTime(e.target.value);
          fileRef.current.currentTime = e.target.value;
        }}
      />
      {time ? <p>{exactTime(currentTime, fileRef)}</p> : null}
    </div>
  );
}

export default MultimediaTimerBar;
