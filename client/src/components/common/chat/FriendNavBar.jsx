import { FaPhone } from "react-icons/fa";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { SlOptionsVertical } from "react-icons/sl";

import { useDispatch, useSelector } from "react-redux";
import { changeChatState } from "../../../app/chatSlice.js";
import { notify } from "../../../utils/notify.js";
import { useState } from "react";

import ChatOptions from "./chatOptions.jsx";
import { activateInfo } from "../../../app/infoSlice.js";

function FriendNavBar() {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const friendState = useSelector((state) => state.friendState);
  const friendsOnlineState = useSelector((state) => state.friendsOnlineState);

  const dispatch = useDispatch();

  const handleCloseChat = () => {
    dispatch(changeChatState(false));
  };

  const handleClick = () => {
    setOptionsOpen(true);
    document.body.addEventListener("pointerdown", function handleEvent(e) {
      if (!e.target.contains(document.getElementById("icon-action-options"))) {
        setOptionsOpen(false);
        document.body.removeEventListener("pointerdown", handleEvent);
      }
    });
    document.body.addEventListener("touchstart", function handleEvent(e) {
      if (!e.target.contains(document.getElementById("icon-action-options"))) {
        setOptionsOpen(false);
        document.body.removeEventListener("click", handleEvent);
      }
    });
  };

  return (
    <div id="chat-nav">
      <div id="info-ctn">
        <IoIosArrowBack id="back-chat-bttn" onClick={handleCloseChat} />
        <div
          id="click-info-ctn"
          onClick={() => {
            dispatch(activateInfo(true));
          }}
        >
          <div className="friend-photo-ctn">
            <div
              className="photo"
              style={{
                "--p": friendState.imgUrl
                  ? `url("${friendState.imgUrl}")`
                  : "url('/profile-img.jpg')",
              }}
            ></div>
          </div>
          <span
            className={`online-in-chat ${
              friendsOnlineState.list[friendState.id] && friendState.areFriends
                ? "active"
                : ""
            }`}
          ></span>
          <h2>{friendState.username}</h2>
        </div>
      </div>
      <div id="action-ctn">
        <FaPhone className="icon-action" onClick={notify} />
        <BsFillCameraVideoFill className="icon-action" onClick={notify} />

        <SlOptionsVertical
          id="icon-action-options"
          className="icon-action"
          onClick={handleClick}
        />
        <div
          id="chat-options-ctn"
          className={`chat-options ${!optionsOpen ? "inactive" : ""}`}
        >
          <ChatOptions />
        </div>
      </div>
    </div>
  );
}

export default FriendNavBar;
