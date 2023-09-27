import { IoIosArrowBack } from "react-icons/io";
import { PiUserCircleMinusBold } from "react-icons/pi";
import { BiSolidVolumeMute } from "react-icons/bi";

import { useDispatch, useSelector } from "react-redux";
import { activateInfo } from "../../../app/infoSlice";
import { changeChatState } from "../../../app/chatSlice";
import { notify } from "../../../utils/notify.js";
import socket from "../../../io";

import {
  useDeleteOfFriendListMutation,
  useGetOutOfChatMutation,
} from "../../../app/queries/getFriendList";

function infoChat() {
  const infoState = useSelector((state) => state.infoState);
  const friendState = useSelector((state) => state.friendState);
  const userState = useSelector((state) => state.userState);
  const friendsOnlineState = useSelector((state) => state.friendsOnlineState);

  const dispatch = useDispatch();
  const [deleteOfFriendList] = useDeleteOfFriendListMutation();
  const [getOutOfChat] = useGetOutOfChatMutation();

  const handleDeleteFriend = () => {
    deleteOfFriendList({
      userId: userState.id,
      friendId: friendState.id,
      conversationId: friendState.conversationId,
    });

    socket.emit("client:hasBeenDeleted", {
      userId: userState.id,
      friendId: friendState.id,
    });

    dispatch(activateInfo(false));
    setTimeout(() => {
      dispatch(changeChatState({ active: false }));
    }, 500);
  };

  const handleLeaveChat = () => {
    getOutOfChat({
      userId: userState.id,
      conversationId: friendState.conversationId,
    });

    dispatch(activateInfo(false));
    setTimeout(() => {
      dispatch(changeChatState({ active: false }));
    }, 500);
  };

  return (
    <div id="info-chat-ctn" className={infoState.active ? "active" : ""}>
      <IoIosArrowBack
        id="close-chat-info"
        onClick={() => dispatch(activateInfo(false))}
      />
      <div id="img-ctn">
        <div
          className="photo"
          style={{
            "--p": friendState.imgUrl
              ? `url("${friendState.imgUrl}")`
              : "url('/profile-img.jpg')",
          }}
        ></div>
        <span
          className={`online-in-chat-info ${
            friendsOnlineState.list[friendState.id] && friendState.areFriends
              ? "active"
              : ""
          }`}
        ></span>
      </div>
      <h2>{friendState.username}</h2>
      <p>{friendState.email}</p>
      <div id="files-chat-ctn" onClick={notify}>
        <h3>Files</h3>
        <div id="files-ctn">
          <p>This feature is not yet available.</p>
        </div>
      </div>
      {friendState.areFriends ? (
        <button onClick={handleDeleteFriend}>
          <PiUserCircleMinusBold className="info-action-icon" />
          Delete from your friend list
        </button>
      ) : (
        <button onClick={handleLeaveChat}>
          <PiUserCircleMinusBold className="info-action-icon" />
          Leave the chat
        </button>
      )}
    </div>
  );
}

export default infoChat;
