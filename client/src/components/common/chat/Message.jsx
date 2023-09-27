import { BiCheck, BiCheckDouble, BiError } from "react-icons/bi";
import { LuClock4 } from "react-icons/lu";

import getTime from "../../../utils/getTime.js";

import React, { Fragment } from "react";
import { useSelector } from "react-redux";

import Document from "./files/Document.jsx";
import Audio from "./files/Audio.jsx";

function Message({ data }) {
  const { item, index } = data;

  let day = null;

  const friendState = useSelector((state) => state.friendState);
  const userState = useSelector((state) => state.userState);

  const itemDate = new Date(item.date);

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

  const setFile = (mimetype, url, who) => {
    switch (mimetype) {
      case "document":
        return <Document data={{ url, who }} />;

      case "audio":
        return <Audio data={{ url, who }} />;

      default:
        break;
    }
  };

  if (friendState.messages[0].sender) {
    return (
      <Fragment key={index}>
        {day !== itemDate.getDate()
          ? ((day = itemDate.getDate()), (<h5>{date()}</h5>))
          : null}
        <li
          className={`mssg ${item.sender == userState.id ? "me" : "not-me"} ${
            item.mimetype ? "file" : ""
          }`}
        >
          {item.mimetype ? (
            <>
              {setFile(
                item.mimetype,
                item.file_url,
                item.sender == userState.id ? "me" : "not-me"
              )}
            </>
          ) : null}
          <p className="mssg-text">{item.content}</p>
          <div className="comp-ctn">
            <p>{getTime(itemDate)}</p>
            {item.sender == userState.id ? setIcon() : null}
          </div>
        </li>
      </Fragment>
    );
  }
}

export default Message;
