import { BsHeadphones } from "react-icons/bs";

import { useEffect, useRef, useState } from "react";

import axios from "axios";
import MultimediaTimerBar from "../../MultimediaTimerBar";

function Audio({ data }) {
  const { url, who } = data;

  const fileRef = useRef(null);

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
    else time = fileRef.current ? fileRef.current.duration : 0;

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

  useEffect(() => {
    handleCreateFile();
  }, []);

  return (
    <div className={`audio chat ${who}`}>
      <BsHeadphones className="icon bigger" />
      <div className="data chat">
        <audio
          ref={fileRef}
          onLoadedData={(e) => setDuration(Math.round(e.target.duration))}
          onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
          onEnded={(e) => {
            setIsPaused(true);
            e.target.currentTime = 0;
          }}
        >
          <source src={url} type={"audio/mpeg"} />
        </audio>
        <MultimediaTimerBar
          data={{
            isPaused,
            setIsPaused,
            duration,
            currentTime,
            fileRef,
            setCurrentTime,
          }}
        />

        <p>
          <span>{`${exactTime(true)} / ${exactTime()}`}</span>
          <span className="right">{exactSize()}</span>
        </p>
      </div>
    </div>
  );
}

export default Audio;
