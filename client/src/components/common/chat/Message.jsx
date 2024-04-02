import { BiCheck, BiCheckDouble, BiError } from "react-icons/bi";
import { LuClock4 } from "react-icons/lu";
import { MdDeleteForever } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";

import getTime from "../../../utils/getTime.js";

import React, { Fragment, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectMessage } from "../../../app/messageSelectSlice.js";

import Document from "./files/Document.jsx";
import Audio from "./files/Audio.jsx";
import Video from "./files/Video.jsx";
import Image from "./files/Image.jsx";
import { useEffect } from "react";

function Message({ data }) {
  const { item, index, day, space, colorList } = data;

  const messageRef = useRef(null);

  const friendState = useSelector((state) => state.friendState);
  const userState = useSelector((state) => state.userState);
  const { isScrolling } = useSelector((state) => state.isScrollingState);
  const { selected: selectMode, messages } = useSelector(
    (state) => state.messageSelectState
  );

  const itemDate = new Date(item.date);

  const dispatch = useDispatch();

  const date = () => {
    const res = (new Date().getTime() - itemDate.getTime()) / 1000 / 60 / 60;

    const weekDay = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    if (res < 24 && new Date().getDate() === itemDate.getDate()) {
      return "Today";
    }
    if (res < 48) {
      return "Yesterday";
    }
    if (res >= 48 && res / 24 < 7) {
      return weekDay[itemDate.getDay()];
    }
    return `${
      month[itemDate.getMonth()]
    } ${itemDate.getDate()}, ${itemDate.getFullYear()}`;
  };

  const setIcon = () => {
    switch (item.message_read) {
      case "sending":
        return <LuClock4 className="chat-icon clock" />;
      case "sent":
        return <BiCheck className="chat-icon" />;
      case 0:
        return <BiCheckDouble className="chat-icon" />;
      case 1:
        return <BiCheckDouble className="chat-icon read" />;
      default:
        return <BiError className="chat-icon error">error</BiError>;
    }
  };

  const setFile = (mimetype, url, who, mssg) => {
    switch (mimetype) {
      case "document":
        return <Document data={{ url, who }} />;

      case "audio":
        return <Audio data={{ url, who }} />;

      case "video":
        return <Video data={{ url, who, time: true, mssg, date: date() }} />;

      case "image":
        return <Image data={{ url, who, mssg, date: date() }} />;

      default:
        break;
    }
  };

  const [selected, setSelected] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [deltaX, setDeltaX] = useState(0);
  const [messagePosition, setMessagePosition] = useState({ x: 0, y: 0 });
  const { open } = useSelector((state) => state.fileOpenState);

  const handleDragStart = (e) => {
    if (!selectMode) {
      messageRef.current = setTimeout(() => {
        dispatch(selectMessage({ data: item, selected: true }));
        setSelected(true);
      }, 1000);

      const isInput = e.target.classList.value.includes("no-move");

      if (!isScrolling && !isInput) {
        setDragStartX(e.touches[0].clientX);
      }
    }
  };

  const handleClick = () => {
    if (!selected) {
      dispatch(selectMessage({ data: item, selected: true }));
      setSelected(true);
    } else {
      setSelected(false);
      if (Object.keys(messages).length <= 1)
        dispatch(
          selectMessage({ data: item, selected: false, unselect: true })
        );
      else
        dispatch(selectMessage({ data: item, selected: true, unselect: true }));
    }
  };

  const handleDrag = (e) => {
    clearTimeout(messageRef.current);

    if (!isScrolling && dragStartX !== null) {
      setDeltaX(e.touches[0].clientX - dragStartX);

      if (item.sender !== userState.id && deltaX > 0 && deltaX < 40) {
        setMessagePosition({ x: deltaX, y: 0 });
      }
      if (item.sender == userState.id && deltaX < 0 && deltaX > -40) {
        setMessagePosition({ x: deltaX, y: 0 });
      }
    }
  };

  const handleDragEnd = () => {
    clearTimeout(messageRef.current);

    setDragStartX(null);
    setMessagePosition({ x: 0, y: 0 });
    setDeltaX(0);

    if (!isScrolling && item.sender !== userState.id && deltaX > 40) {
      console.log(deltaX);
    }
    if (!isScrolling && item.sender == userState.id && deltaX < -40) {
      console.log(deltaX);
    }
  };

  const generateText = () => {
    const { username, oldPhoto, newPhoto, text } = JSON.parse(item.content);

    if (newPhoto) {
      return (
        <>
          <p>{username} has changed the group photo</p>
          <div>
            {oldPhoto ? (
              <>
                <div
                  className="photo"
                  style={{
                    "--p": `url("${oldPhoto}")`,
                  }}
                ></div>
                <FaChevronRight />
              </>
            ) : null}
            <div
              className="photo"
              style={{ "--p": `url("${newPhoto}")` }}
            ></div>
          </div>
        </>
      );
    } else {
      return <p>{text}</p>;
    }
  };

  useEffect(() => {
    if (!selectMode) {
      setSelected(false);
    }
  }, [selectMode]);

  useEffect(() => {
    // if (item.event) console.log(item);
  }, []);

  if ((item.sender && !item.deleted) || item.event) {
    return (
      <Fragment key={index}>
        {/* {day !== itemDate.getDate()
          ? ((day = itemDate.getDate()), (<h5>{date()}</h5>))
          : null} */}
        {item.event ? (
          <div className="event">{generateText()}</div>
        ) : (
          <li
            className={`mssg ${item.sender == userState.id ? "me" : "not-me"} ${
              item.mimetype ? "file" : ""
            } ${space ? "space" : ""} ${!item.is_show ? "deleted" : ""} ${
              friendState.groupData &&
              friendState.groupData.isGroup &&
              item.sender != userState.id
                ? "left"
                : ""
            }`}
            onClick={selectMode ? handleClick : null}
            onTouchStart={(e) => (!open ? handleDragStart(e) : null)}
            onTouchMove={(e) => (!open ? handleDrag(e) : null)}
            onTouchEnd={(e) => (!open ? handleDragEnd() : null)}
            style={{
              transition: !open ? "transform ease-out .3s" : "none",
              transform: open
                ? "none"
                : `translate(${messagePosition.x}px, ${messagePosition.y}px)`,
            }}
          >
            {friendState.groupData &&
            friendState.groupData.isGroup &&
            item.sender != userState.id &&
            space ? (
              <>
                <div
                  className="photo"
                  style={{
                    "--p": item.imgUrl
                      ? `url("${item.imgUrl}")`
                      : `url("/profile-img.jpg")`,
                  }}
                ></div>
                <h4 style={{ color: colorList[item.sender] }}>
                  {item.username}
                </h4>
              </>
            ) : null}
            {item.is_show ? (
              <>
                {item.mimetype ? (
                  <>
                    {setFile(
                      item.mimetype,
                      item.file_url,
                      item.sender == userState.id ? "me" : "not-me",
                      item.content
                    )}
                  </>
                ) : null}

                <p className="mssg-text">
                  {item.content}&nbsp;&nbsp;
                  <i className="date">{getTime(itemDate)}</i>
                </p>
              </>
            ) : (
              <div className="deleted">
                <MdDeleteForever className="icon" />
                <p className="mssg-text deleted">
                  {userState.id !== item.sender
                    ? `${item.username} has deleted this message.`
                    : "You have deleted this message"}
                </p>
              </div>
            )}
            {/* <div className="comp-ctn">
            <p>{getTime(itemDate)}</p>
            {item.sender == userState.id ? setIcon() : null}
          </div> */}
            <span
              className={`${selected ? "active" : ""} ${
                friendState.groupData && friendState.groupData.isGroup
                  ? "right"
                  : ""
              }`}
            ></span>
          </li>
        )}
      </Fragment>
    );
  }
}

export default Message;
