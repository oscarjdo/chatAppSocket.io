import { FaPlay } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { BiSolidDownload } from "react-icons/bi";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFileOpen } from "../../../../app/fileOpenSlice";
import axios from "axios";
import downloadFile from "../../../../utils/downloadFile";
import exactSize from "../../../../utils/exactSize";
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
  const { selected } = useSelector((state) => state.messageSelectState);

  const dispatch = useDispatch();

  const handleCreateFile = async () => {
    const response = await axios(url);

    setSize(response.headers.getContentLength());
  };

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
    handleCreateFile();
  }, []);

  return (
    <div className={`video-message-ctn ${open ? "active" : ""}`}>
      {!open ? (
        <div
          className="ctn-clickable"
          onClick={() => {
            if (!selected) {
              setOpen(true);
              dispatch(setFileOpen(true));
            }
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
              <p>{exactSize(size)}</p>
            </div>
            <a ref={anchorRef}>
              <BiSolidDownload
                className="icon"
                onClick={() => downloadFile(url, anchorRef)}
              />
            </a>
          </div>
          <video
            ref={fileRef}
            id="multimediaTag"
            onClick={handlePause}
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
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Video;
