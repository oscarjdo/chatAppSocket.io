import { IoIosArrowBack } from "react-icons/io";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setFilesMenuState } from "../../../../app/filesMenuSlice.js";
import { setScrollToState } from "../../../../app/scrollToSlice";
import { changeChatState } from "../../../../app/chatSlice";
import { activateInfo } from "../../../../app/infoSlice.js";

import Video from "../../../common/Video.jsx";
import Image from "../../../common/Image.jsx";
import Document from "../../../common/Document.jsx";

function FilesMenu() {
  const [bttnsSelected, setBttnsSelected] = useState(0);
  const [files, setFiles] = useState([]);
  const [links, setLinks] = useState([]);

  const justifyContent = { 0: "", 1: "center", 2: "end" };

  const userState = useSelector((state) => state.userState);
  const friendState = useSelector((state) => state.friendState);
  const { open } = useSelector((state) => state.filesMenuState);

  const dispatch = useDispatch();

  const handleGoToMessage = (item) => {
    dispatch(
      changeChatState({
        active: true,
        conversationId: item.conversation_id,
      })
    );

    setTimeout(() => {
      setBttnsSelected(0);
      dispatch(activateInfo(false));
    }, 300);

    dispatch(setFilesMenuState({}));

    setTimeout(() => {
      dispatch(
        setScrollToState({ to: `messageId${item.message_id}`, time: 0 })
      );
    }, 600);
  };

  const date = (item) => {
    const itemDate = new Date(item.date);

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

  useEffect(() => {
    if (!friendState) return;

    const fileList = friendState.messages.filter(
      (item) =>
        (item.mimetype == "image" ||
          item.mimetype == "video" ||
          item.mimetype == "document") &&
        !item.deleted &&
        item.is_show
    );

    setFiles(fileList);

    const mssgsFiltered = friendState.messages
      .filter((item) => item.content.match(/https?:\/\/[^\s]+/))
      .map((item) =>
        [...item.content.matchAll(/https?:\/\/[^\s]+/g)].map((it) =>
          Object.assign(
            {
              message_id: item.message_id,
              conversation_id: item.conversation_id,
              deleted: item.deleted,
              is_show: item.is_show,
            },
            it
          )
        )
      )
      .flat();

    setLinks(mssgsFiltered);
  }, [friendState]);

  return (
    <div id="filesMenu" className={open ? "active" : ""}>
      <div className="nav">
        <button
          type="button"
          className="icon"
          onClick={() => {
            setTimeout(() => {
              setBttnsSelected(0);
            }, 300);
            dispatch(setFilesMenuState({}));
          }}
        >
          <IoIosArrowBack className="icon" />
        </button>
        <button
          type="button"
          className={`nav ${bttnsSelected == 0 ? "active" : ""}`}
          onClick={() => setBttnsSelected(0)}
        >
          <span>Media</span>
        </button>

        <button
          type="button"
          className={`nav ${bttnsSelected == 1 ? "active" : ""}`}
          onClick={() => setBttnsSelected(1)}
        >
          <span>Document</span>
        </button>

        <button
          type="button"
          className={`nav ${bttnsSelected == 2 ? "active" : ""}`}
          onClick={() => setBttnsSelected(2)}
        >
          <span>Link</span>
        </button>
      </div>
      <div className={`ctn ${justifyContent[bttnsSelected]}`}>
        <ul className="section">
          {files
            .filter((item) => item.mimetype != "document")
            .map((item, index) => (
              <li key={index}>
                {item.mimetype == "image" ? (
                  <Image
                    data={{
                      url: item.file_url,
                      who: item.sender == userState.id ? "me" : "not-me",
                      mssg: item.content,
                      date: date(item),
                      infoChatFile: true,
                    }}
                  />
                ) : (
                  <Video
                    data={{
                      url: item.file_url,
                      who: item.sender == userState.id ? "me" : "not-me",
                      time: true,
                      mssg: item.content,
                      date: date(item),
                      infoChatFile: true,
                    }}
                  />
                )}
              </li>
            ))}
        </ul>

        <ul className="section">
          {files
            .filter((item) => item.mimetype == "document")
            .map((item, index) => (
              <li key={index} className="documentItemCtn">
                <Document
                  data={{
                    url: item.file_url,
                    who: "me",
                  }}
                />
                <button
                  type="button"
                  className="goToMssgBttn"
                  onClick={() => handleGoToMessage(item)}
                >
                  Go to the message <IoIosArrowBack className="icon" />
                </button>
              </li>
            ))}
        </ul>

        <ul className="section">
          {links.map((item, index) =>
            !item.deleted && item.is_show ? (
              <li key={index} className="linkItemCtn">
                <p>
                  <a href={item[0]} target="_blank">
                    {item[0]}
                  </a>
                </p>
                <button
                  type="button"
                  className="goToMssgBttn"
                  onClick={() => handleGoToMessage(item)}
                >
                  Go to the message <IoIosArrowBack className="icon" />
                </button>
              </li>
            ) : null
          )}
        </ul>
      </div>
    </div>
  );
}

export default FilesMenu;
