import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { BiPlay, BiSolidSend, BiTrash } from "react-icons/bi";
import { BsFillImageFill } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";

import {
  deleteFileToPreview,
  setFileToPreview,
  setTexts,
} from "../../../../../app/filePreviewSlice";

import VideoPrev from "./imageAndVideo/VideoPrev";
import exactSize from "../../../../../utils/exactSize";
import exactTime from "../../../../../utils/exactTime";

function ImageAndVideo() {
  const videoTarget = useRef(null);

  const { data, mssgs } = useSelector((state) => state.filePreviewState);
  const friendState = useSelector((state) => state.friendState);

  const [loaded, setLoaded] = useState(false);
  const [itemSelected, setitemSelected] = useState({});
  const [paused, setPaused] = useState(true);

  const dispatch = useDispatch();

  const handleSelectItem = (item, index) => {
    setPaused(true);
    setLoaded(false);

    const { url, mimetype } = item;
    const { id, size } = item.file;

    if (id == itemSelected.id) {
      const ind = index == data.length - 1 ? index - 1 : index + 1;

      const { url, mimetype } = data[ind];
      const { id } = data[ind].file;

      setitemSelected({ url, mimetype, id, size });
      return dispatch(deleteFileToPreview({ id: item.file.id, index, data }));
    }

    return setitemSelected({ url, mimetype, id, size });
  };

  const handleChange = (e) => {
    const value = e.target.value;

    dispatch(setTexts({ id: itemSelected.id, value }));
  };

  const handleClose = () => {
    dispatch(setTexts({ clear: true }));

    dispatch(setFileToPreview({}));
  };

  const setPlay = () => {
    const video = videoTarget.current;

    if (paused) {
      video.play();
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  };

  useEffect(() => {
    const { url, mimetype } = data[0];
    const { id } = data[0].file;

    setitemSelected({ url, mimetype, id });
  }, []);

  return (
    <div id="imageAndVideoCtn">
      <button type="button" onClick={handleClose}>
        <IoIosArrowBack className="icon" />
      </button>

      <div id="imageAndVideoWrapper">
        {itemSelected.mimetype == "image" ? (
          <div className="item">
            <img src={itemSelected.url} alt="image" />
          </div>
        ) : null}

        {itemSelected.mimetype == "video" ? (
          <div className="item" onClick={setPlay}>
            <div>
              <span>{exactSize(itemSelected.size)}</span>
              <span>{loaded ? exactTime(null, videoTarget) : null}</span>
            </div>
            <video
              ref={videoTarget}
              src={itemSelected.url}
              onLoadedData={() => setLoaded(true)}
            ></video>
            <BiPlay className={`icon ${!paused ? "inactive" : ""}`} />
          </div>
        ) : null}
      </div>

      <div
        id="imageAndVideoMiniPreview"
        className={data.length <= 1 ? "disappear" : ""}
      >
        <ul>
          {data.map((item, index) =>
            item.mimetype == "image" || item.mimetype == "video" ? (
              <li
                key={index}
                className={itemSelected.id == item.file.id ? "selected" : ""}
                onClick={() => handleSelectItem(item, index)}
              >
                {item.mimetype == "image" ? (
                  <div
                    className="photo"
                    style={{ "--p": `url("${item.url}")` }}
                  ></div>
                ) : null}

                {item.mimetype == "video" ? (
                  <VideoPrev item={item} data={data} />
                ) : null}

                <BiTrash className="icon" />
              </li>
            ) : null
          )}
        </ul>
      </div>
      <div className="imageAndVideoForm">
        <button type="button" className={data.length >= 10 ? "disappear" : ""}>
          <label htmlFor={data.length >= 10 ? "" : "gallery"}>
            <BsFillImageFill className="icon" />
          </label>
        </button>
        <textarea
          type="text"
          value={mssgs[itemSelected.id] || ""}
          placeholder="Say something"
          onChange={handleChange}
        />
        <button type="submit">
          <BiSolidSend className="icon" />
        </button>
      </div>
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
}

export default ImageAndVideo;
