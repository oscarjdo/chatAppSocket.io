import { BsHeadphones } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { TiMediaPause } from "react-icons/ti";

import { useEffect, useRef, useState } from "react";

import axios from "axios";

function Audio({ data }) {
  const { url, who } = data;

  const audioRef = useRef(null);
  const inputRef = useRef(null);

  const [isPaused, setIsPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [size, setSize] = useState(0);

  const handleCreateFile = async () => {
    const response = await axios(url);

    setSize(response.headers.getContentLength());
  };

  const exactTime = (useCurrentTime) => {
    let time;

    if (useCurrentTime) time = currentTime;
    else time = audioRef.current ? audioRef.current.duration : 0;

    let minutes = 0;
    let hours = 0;
    time = Math.round(time);

    while (time > 59) {
      time -= 60;
      minutes++;

      if (minutes > 59) {
        minutes -= 60;
        hours++;
      }
    }

    if (time < 10) time = `0${time}`;
    if (minutes < 10) minutes = `0${minutes}`;
    if (hours < 10) hours = `0${hours}`;

    return `${hours > 0 ? hours + ":" : ""}${
      minutes > 0 || hours > 0 ? minutes + ":" : "00:"
    }${time}`;
  };

  const exactSize = () => {
    let changeSize = size;

    const fileExt = ["Bytes", "KB", "MB", "GB"];
    let i = 0;
    while (changeSize > 900) {
      changeSize /= 1024;
      i++;
    }

    return `${Math.round(changeSize * 100) / 100} ${fileExt[i]}`;
  };

  const handlePause = async () => {
    if (isPaused) {
      audioRef.current.play();
      setIsPaused(false);
    } else {
      audioRef.current.pause();
      setIsPaused(true);
    }
  };

  useEffect(() => {
    handleCreateFile();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.backgroundSize =
        (inputRef.current.value * 100) / inputRef.current.max + "% 100%";
    }
  }, [currentTime, isPaused, duration]);

  return (
    <div className="audio chat">
      <BsHeadphones className="icon bigger" />
      <div className="data chat">
        <audio
          ref={audioRef}
          onLoadedData={(e) => setDuration(Math.round(e.target.duration))}
          onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
          onEnded={(e) => {
            setIsPaused(true);
            e.target.currentTime = 0;
          }}
        >
          <source src={url} type={"audio/mpeg"} />
        </audio>
        <div>
          <button onClick={handlePause}>
            {isPaused ? (
              <FaPlay className="icon" />
            ) : (
              <TiMediaPause className="icon bigger" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            name=""
            ref={inputRef}
            onTouchStart={() => audioRef.current.pause()}
            onTouchEnd={() => {
              if (!isPaused) audioRef.current.play();
            }}
            onChange={(e) => {
              setCurrentTime(e.target.value);
              audioRef.current.currentTime = e.target.value;
            }}
          />
        </div>

        <p>
          <span>{`${exactTime(true)} / ${exactTime()}`}</span>
          <span className="right">{exactSize()}</span>
        </p>
      </div>
    </div>
  );
}

export default Audio;
