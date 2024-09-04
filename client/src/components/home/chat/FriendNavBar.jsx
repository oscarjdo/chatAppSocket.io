import { useDispatch, useSelector } from "react-redux";

import { FaPhone } from "react-icons/fa";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { SlOptionsVertical } from "react-icons/sl";

import MessageMenu from "./friendNavBar/MessageMenu.jsx";
import ChatSearchBar from "./friendNavBar/ChatSearchBar.jsx";

import { changeChatState } from "../../../app/chatSlice.js";
import { setReplyMessageState } from "../../../app/replyMessageSlice.js";
import { setSideMenusState } from "../../../app/sideMenusSlice.js";
import { activateInfo } from "../../../app/infoSlice.js";

import { notify } from "../../../utils/notify.js";

function FriendNavBar() {
  const friendState = useSelector((state) => state.friendState);
  const friendsOnlineState = useSelector((state) => state.friendsOnlineState);

  const dispatch = useDispatch();

  const handleCloseChat = () => {
    dispatch(changeChatState(false));
    dispatch(setReplyMessageState({}));
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
            onClick={() => dispatch(setSideMenusState({ type: "chatMenu" }))}
          />
        </div>
      </div>
      <MessageMenu />
      <ChatSearchBar />
    </div>
  );
}

export default FriendNavBar;
