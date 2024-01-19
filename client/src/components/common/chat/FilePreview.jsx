import { FaPlay } from "react-icons/fa";
import { TiMediaPause } from "react-icons/ti";
import { IoDocument } from "react-icons/io5";
import { BsHeadphones } from "react-icons/bs";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MultimediaTimerBar from "../MultimediaTimerBar";
import { useRef } from "react";

const FilePreview = () => {
  const friendState = useSelector((state) => state.friendState);
  const videoAudioState = useSelector((state) => state.videoAudioState);

  const [isPaused, setIsPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const restoreValues = () => {
    setIsPaused(true);
    setDuration(0);
    setCurrentTime(0);
  };

  useEffect(() => {
    const videoAudioInput = document.getElementById("videoAudioInput");

    if (videoAudioInput) {
      videoAudioInput.style.backgroundSize =
        (videoAudioInput.value * 100) / videoAudioInput.max + "% 100%";
    }
  }, [currentTime, isPaused, duration]);

  const exactTime = (useCurrentTime) => {
    const multimediaPlayer = document.getElementById("multimediaTag");

    let time;

    if (useCurrentTime) time = currentTime;
    else time = multimediaPlayer ? multimediaPlayer.duration : 0;

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

  const handlePause = () => {
    const multimediaPlayer = document.getElementById("multimediaTag");

    if (isPaused) {
      multimediaPlayer.play();
      setIsPaused(false);
    } else {
      multimediaPlayer.pause();
      setIsPaused(true);
    }
  };

  if (!videoAudioState.file) {
    if (!isPaused || duration !== 0 || currentTime !== 0) restoreValues();
    return null;
  }

  let size = videoAudioState.file.size;
  const fileExt = ["Bytes", "KB", "MB", "GB"];
  let i = 0;

  while (size > 900) {
    size /= 1024;
    i++;
  }

  const exactSize = `${Math.round(size * 100) / 100} ${fileExt[i]}`;

  if (videoAudioState.mimetype == "document")
    return (
      <div className="document">
        <IoDocument className="icon" />
        <div className="data">
          <h3>{videoAudioState.file.name || "x"}</h3>
          <p>Type: {videoAudioState.file.type || "x"}</p>
          <p>Size: {exactSize || "x"}</p>
        </div>
      </div>
    );
  else if (videoAudioState.mimetype == "image") {
    return (
      <div className="image">
        <img src={videoAudioState.url} alt="image" />
        <p>
          {friendState.groupData && friendState.groupData.isGroup ? (
            friendState.members.map((item, index) => (
              <span key={index}>{item.username.split(" ")[0]}</span>
            ))
          ) : (
            <span>{friendState.username.split(" ")[0]}</span>
          )}
        </p>
      </div>
    );
  } else if (videoAudioState.mimetype == "video") {
    return (
      <div className="video-ctn">
        <p>
          {friendState.groupData && friendState.groupData.isGroup ? (
            friendState.members.map((item, index) => (
              <span key={index}>{item.username.split(" ")[0]}</span>
            ))
          ) : (
            <span>{friendState.username.split(" ")[0]}</span>
          )}
        </p>
        {/* <span>{exactSize}</span>
          <span>{exactTime()}</span> */}
        <div id="video-controller" onClick={handlePause}>
          <video
            id="multimediaTag"
            onLoadedData={(e) => setDuration(Math.round(e.target.duration))}
            onTimeUpdate={(e) => {
              setCurrentTime(e.target.currentTime);
            }}
            onEnded={(e) => {
              setIsPaused(true);
              e.target.currentTime = 0;
            }}
          >
            <source
              src={videoAudioState.url}
              type={videoAudioState.file.type}
            />
          </video>
          <span className={isPaused ? "active" : ""}>
            <FaPlay className="icon" />
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          name=""
          id="videoAudioInput"
          className="timer-bar"
          onTouchStart={() => document.getElementById("multimediaTag").pause()}
          onTouchEnd={() => {
            if (!isPaused) document.getElementById("multimediaTag").play();
          }}
          onChange={(e) => {
            setCurrentTime(e.target.value);
            document.getElementById("multimediaTag").currentTime =
              e.target.value;
          }}
        />
      </div>
    );
  } else if (videoAudioState.mimetype == "audio") {
    return (
      <div className="audio">
        <BsHeadphones className="icon bigger" />
        <div className="data">
          <audio
            id="multimediaTag"
            onLoadedData={(e) => setDuration(Math.round(e.target.duration))}
            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
            onEnded={(e) => {
              setIsPaused(true);
              e.target.currentTime = 0;
            }}
          >
            <source
              src={videoAudioState.url}
              type={videoAudioState.file.type}
            />
          </audio>
          <MultimediaTimerBar
            data={{
              isPaused,
              setIsPaused,
              duration,
              currentTime,
              fileRef: { current: document.getElementById("multimediaTag") },
              setCurrentTime,
            }}
          />

          <p>
            <span>{`${exactTime(true)} / ${exactTime()}`}</span>
            <span className="right">{exactSize}</span>
          </p>
        </div>
      </div>
    );
  } else return <p>Null</p>;
};

export default FilePreview;
