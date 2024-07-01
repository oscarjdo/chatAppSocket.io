import { MdDeleteForever } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";
import { TbStarFilled } from "react-icons/tb";

import getTime from "../../../utils/getTime.js";

import React, { Fragment, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectMessage } from "../../../app/messageSelectSlice.js";
import { setReplyMessageState } from "../../../app/replyMessageSlice.js";
import { setChatSearchBarState } from "../../../app/chatSearchBarSlice.js";

import Document from "./files/Document.jsx";
import Audio from "./files/Audio.jsx";
import Video from "./files/Video.jsx";
import Image from "./files/Image.jsx";
import { useEffect } from "react";
import SetIcon from "../../SetIcon.jsx";

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
  const [answeredMessageData, setAnsweredMessageData] = useState(null);

  const handleDragStart = (e) => {
    if (!selectMode) {
      messageRef.current = setTimeout(() => {
        dispatch(selectMessage({ data: item, selected: true }));
        dispatch(setChatSearchBarState({ open: false }));
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
      dispatch(setChatSearchBarState({ open: false }));
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

    const messageData = {
      open: true,
      id: item.message_id,
      content: item.content,
      senderUsername: item.username,
      senderId: item.sender,
      fileUrl: item.file_url,
      color: colorList[item.sender],
      mimetype: item.mimetype,
    };

    if (!isScrolling && item.sender !== userState.id && deltaX > 40) {
      dispatch(setReplyMessageState(messageData));
    }
    if (!isScrolling && item.sender == userState.id && deltaX < -40) {
      dispatch(setReplyMessageState(messageData));
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
    if (item.answeredMessage) {
      setAnsweredMessageData(JSON.parse(item.answeredMessage));
    }
  }, []);

  const setFileType = () => {
    let mimetype = answeredMessageData.mimetype;

    if (!mimetype) {
      return <p className="content">{answeredMessageData.content}</p>;
    }

    mimetype = mimetype[0].toUpperCase().concat(mimetype.slice(1));

    const icon = {
      Image: "📷",
      Audio: "🔉",
      Video: "🎬",
      Document: "📃",
    };

    return (
      <p className="content">
        <span>{icon[mimetype]}</span>
        {mimetype}
        {answeredMessageData.content ? " - " : ""}
        {answeredMessageData.content}
      </p>
    );
  };

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
            id={`messageId${item.message_id}`}
            className={`mssg ${item.sender == userState.id ? "me" : "not-me"} ${
              item.mimetype ? "file" : ""
            } ${space ? "space" : ""} ${!item.is_show ? "deleted" : ""} ${
              friendState.groupData &&
              friendState.groupData.isGroup &&
              item.sender != userState.id
                ? "left"
                : ""
            } ${item.forwarded ? "forwarded" : ""}`}
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
            {item.forwarded ? <p className="forwardedText">Forwarded</p> : null}

            {answeredMessageData ? (
              <div
                id="replyCtn"
                onClick={() => {
                  if (selectMode) return;

                  let element = document.getElementById(
                    `messageId${answeredMessageData.id}`
                  );

                  return element.scrollIntoView();
                }}
              >
                <div>
                  <p
                    className="username"
                    style={{ color: colorList[answeredMessageData.senderId] }}
                  >
                    {answeredMessageData.sender == userState.username
                      ? "You"
                      : answeredMessageData.sender}
                  </p>
                  {setFileType()}
                </div>
                {answeredMessageData.mimetype == "video" ? (
                  <video
                    className="media"
                    src={answeredMessageData.fileData.url}
                  ></video>
                ) : null}
                {answeredMessageData.mimetype == "image" ? (
                  <img
                    className="media"
                    src={answeredMessageData.fileData.url}
                    alt=""
                  />
                ) : null}
              </div>
            ) : null}
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
                  <i className="date">
                    {item.featured ? <TbStarFilled /> : ""}
                    {getTime(itemDate)}
                    {item.sender == userState.id &&
                    !friendState.groupData.isGroup ? (
                      <SetIcon item={item} />
                    ) : null}
                  </i>
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
