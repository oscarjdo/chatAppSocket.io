import { FaPhone } from "react-icons/fa";
import {
  BsFillCameraVideoFill,
  BsFillTrashFill,
  BsStarFill,
} from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { BiSolidShare } from "react-icons/bi";
import { SlOptionsVertical } from "react-icons/sl";

import { useDispatch, useSelector } from "react-redux";
import { changeChatState } from "../../../app/chatSlice.js";
import { selectMessage } from "../../../app/messageSelectSlice.js";
import { setModalState } from "../../../app/modalSlice.js";
import { notify } from "../../../utils/notify.js";
import { useState } from "react";

import ChatOptions from "./chatOptions.jsx";
import { activateInfo } from "../../../app/infoSlice.js";

function FriendNavBar() {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const friendState = useSelector((state) => state.friendState);
  const friendsOnlineState = useSelector((state) => state.friendsOnlineState);
  const { selected, messages } = useSelector(
    (state) => state.messageSelectState
  );

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

  const handleClickOnTrash = () => {
    dispatch(setModalState({ open: true, messages }));
  };

  return (
    <div id="chat-nav">
      <div>
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
                style={
                  friendState.groupData
                    ? {
                        "--p": !friendState.groupData.isGroup
                          ? `url("${friendState.imgUrl || "/profile-img.jpg"}")`
                          : `url("${
                              friendState.groupData.img_url ||
                              "/group-photo.jpg"
                            }")`,
                      }
                    : null
                }
              ></div>
            </div>
            {friendState.groupData && !friendState.groupData.isGroup ? (
              <span
                className={`online-in-chat ${
                  friendsOnlineState.list[friendState.id] &&
                  friendState.areFriends
                    ? "active"
                    : ""
                }`}
              ></span>
            ) : null}
            <h2>
              {friendState.groupData && friendState.groupData.isGroup
                ? friendState.groupData.group_name
                : friendState.username}
            </h2>
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
      <div className={`message-menu ${selected ? "active" : ""}`}>
        <div className="little">
          <button
            type="button"
            onClick={() =>
              dispatch(selectMessage({ data: false, selected: false }))
            }
          >
            <IoIosArrowBack className="icon" />
          </button>
          <p>{Object.keys(messages).length}</p>
        </div>
        <div className="big">
          <button
            type="button"
            className={`${Object.keys(messages).length > 1 ? "disappear" : ""}`}
          >
            <BiSolidShare className="icon" />
          </button>

          <button type="button">
            <BsStarFill className="icon" />
          </button>

          <button type="button" onClick={handleClickOnTrash}>
            <BsFillTrashFill className="icon" />
          </button>

          <button type="button">
            <BiSolidShare className="icon turn" />
          </button>

          <button
            type="button"
            className={`${Object.keys(messages).length > 1 ? "disappear" : ""}`}
          >
            <SlOptionsVertical className="icon" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FriendNavBar;
