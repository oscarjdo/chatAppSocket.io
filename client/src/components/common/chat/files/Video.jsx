import { FaPlay } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { BiSolidDownload } from "react-icons/bi";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFileOpen } from "../../../../app/fileOpenSlice";
import axios from "axios";
import MultimediaTimerBar from "../../MultimediaTimerBar";

function Video({ data }) {
  const { url, who, time, mssg, date } = data;

  const fileRef = useRef(null);
  const anchorRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [size, setSize] = useState("00:00");
  const [isPaused, setIsPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const friendState = useSelector((state) => state.friendState);

  const dispatch = useDispatch();

  const handleCreateFile = async () => {
    const response = await axios(url);

    setSize(response.headers.getContentLength());
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

  const handleClick = async () => {
    const response = await axios.get(url);
    let metadata = {
      type: response.headers.getContentType(),
    };

    const file = new File([response.data], url.split("3000/").at(-1), metadata);

    const newUrl = URL.createObjectURL(file);

    anchorRef.current.download = url.split("3000/").at(-1);
    anchorRef.current.href = newUrl;
    anchorRef.current.click();
  };

  return (
    <div className={`video-message-ctn ${open ? "active" : ""}`}>
      {!open ? (
        <div
          className="ctn-clickable"
          onClick={() => {
            setOpen(true);
            dispatch(setFileOpen(true));
          }}
        >
          <video>
            <source src={url} type="video/mp4" />
            <source src={url} type="video/webm" />
            <source src={url} type="video/wmv" />
            This file is not supported.
          </video>
          <span>
            <FaPlay className="icon-play" />
          </span>
        </div>
      ) : (
        <>
          <div className="up-bar">
            <IoIosArrowBack
              className="back-icon"
              onClick={() => {
                setOpen(false);
                setIsPaused(true);
                setCurrentTime(0);
                dispatch(setFileOpen(false));
              }}
            />
            <div>
              <div>
                <p>{who == "me" ? "You" : friendState.username}</p>
                <p>{date}</p>
              </div>
              <p>{exactSize()}</p>
            </div>
            <a ref={anchorRef}>
              <BiSolidDownload className="icon" onClick={handleClick} />
            </a>
          </div>
          <video
            ref={fileRef}
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
            <source src={url} type="video/mp4" />
            <source src={url} type="video/webm" />
            <source src={url} type="video/wmv" />
            This file is not supported.
          </video>
          <div className="down-bar">
            {mssg ? <p>{mssg}</p> : null}
            <MultimediaTimerBar
              data={{
                isPaused,
                duration,
                currentTime,
                fileRef,
                time: time ? time : false,
                setIsPaused,
                setCurrentTime,
                exactTime,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Video;
