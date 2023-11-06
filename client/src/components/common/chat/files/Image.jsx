import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFileOpen } from "../../../../app/fileOpenSlice";
import axios from "axios";
import downloadFile from "../../../../utils/downloadFile";
import exactSize from "../../../../utils/exactSize";
import { IoIosArrowBack } from "react-icons/io";
import { BiSolidDownload } from "react-icons/bi";

function Image({ data }) {
  const { url, who, mssg, date } = data;

  const anchorRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [size, setSize] = useState("00:00");

  const friendState = useSelector((state) => state.friendState);
  const { selected } = useSelector((state) => state.messageSelectState);

  const dispatch = useDispatch();

  const handleCreateFile = async () => {
    const response = await axios(url);

    setSize(response.headers.getContentLength());
  };

  useEffect(() => {
    handleCreateFile();
  }, []);

  return (
    <div className={`image-message-ctn ${open ? "active" : ""}`}>
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
          <img src={url} alt="image" />
        </div>
      ) : (
        <>
          <div className="up-bar">
            <IoIosArrowBack
              className="back-icon"
              onClick={() => {
                setOpen(false);
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
          <img src={url} alt="image" />
          {mssg ? (
            <div className="down-bar">
              <p className="up">{mssg}</p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export default Image;
