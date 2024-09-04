import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

import { BsHeadphones } from "react-icons/bs";

import MultimediaTimerBar from "../../../../common/MultimediaTimerBar";

import exactTime from "../../../../../utils/exactTime";
import exactSize from "../../../../../utils/exactSize";

function Audio() {
  const audioTarget = useRef();

  const [isPaused, setIsPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const { data } = useSelector((state) => state.filePreviewState);

  return (
    <div className="audio">
      <BsHeadphones className="icon bigger" />
      <div className="data">
        <audio
          id="multimediaTag"
          ref={audioTarget}
          onLoadedData={(e) => setDuration(Math.round(e.target.duration))}
          onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
          onEnded={(e) => {
            setIsPaused(true);
            e.target.currentTime = 0;
          }}
        >
          <source src={data[0].url} type={data[0].file.type} />
        </audio>
        <MultimediaTimerBar
          data={{
            isPaused,
            setIsPaused,
            duration,
            currentTime,
            fileRef: audioTarget,
            setCurrentTime,
          }}
        />
        <p>
          <span>{`${exactTime(currentTime, audioTarget, true)} / ${exactTime(
            null,
            audioTarget
          )}`}</span>
          <span className="right">{exactSize(data[0].file.size)}</span>
        </p>
      </div>
    </div>
  );
}

export default Audio;
