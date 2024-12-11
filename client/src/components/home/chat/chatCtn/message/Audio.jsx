import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { BsHeadphones } from "react-icons/bs";

import MultimediaTimerBar from "../../../../common/MultimediaTimerBar";

import exactSize from "../../../../../utils/exactSize";
import exactTime from "../../../../../utils/exactTime";

import axios from "axios";

function Audio({ data }) {
  const { url, who } = data;

  const fileRef = useRef(null);

  const [isPaused, setIsPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [size, setSize] = useState(0);

  const { selected } = useSelector((state) => state.messageSelectState);

  const handleCreateFile = async () => {
    const response = await axios(url);

    setSize(response.headers.getContentLength());
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
            selected,
          }}
        />

        <p>
          <span>{`${exactTime(currentTime, fileRef, true)} / ${exactTime(
            currentTime,
            fileRef
          )}`}</span>
          <span className="right">{exactSize(size)}</span>
        </p>
      </div>
    </div>
  );
}

export default Audio;
