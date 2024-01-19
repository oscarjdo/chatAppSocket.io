import { IoIosArrowBack } from "react-icons/io";
import { PiUserCircleMinusBold } from "react-icons/pi";
import { FaUserFriends, FaArrowRight } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { activateInfo } from "../../../app/infoSlice";
import { changeChatState } from "../../../app/chatSlice";
import { setMember } from "../../../app/groupMemberMenuSlice";

import { notify } from "../../../utils/notify.js";
import socket from "../../../io";

import {
  useDeleteOfFriendListMutation,
  useGetOutOfChatMutation,
} from "../../../app/queries/getFriendList";

import GroupMemberMenu from "./GroupMemberMenu.jsx";

function infoChat() {
  const infoState = useSelector((state) => state.infoState);
  const friendState = useSelector((state) => state.friendState);
  const userState = useSelector((state) => state.userState);
  const friendsOnlineState = useSelector((state) => state.friendsOnlineState);
  const { open } = useSelector((state) => state.groupMemberMenuState);

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

  const handleClick = (item) => {
    dispatch(
      setMember({
        open: true,
        userData: {
          username: item.username,
          userId: item.id,
          conversationId: item.conversationId,
          areFriends: item.areFriends,
          pendingFriendRequest: item.pendingFriendRequest,
        },
      })
    );
  };

  const setIcon = (item) => {
    if (item.areFriends) {
      return <FaUserFriends className="icon" />;
    } else if (item.pendingFriendRequest) {
      return <FaArrowRight className="icon" />;
    } else {
      return null;
    }
  };

  return (
    <div
      id="info-chat-ctn"
      className={`${infoState.active ? "active" : ""} ${open ? "open" : ""}`}
    >
      <IoIosArrowBack
        id="close-chat-info"
        onClick={() => dispatch(activateInfo(false))}
      />
      <div id="img-ctn">
        <div
          className="photo"
          style={{
            "--p":
              friendState.groupData && friendState.groupData.isGroup
                ? `url("${
                    friendState.groupData.img_url || "/group-photo.jpg"
                  }")`
                : `url("${friendState.imgUrl || "/profile-img.jpg"}")`,
          }}
        ></div>
        {friendState.groupData && !friendState.groupData.isGroup ? (
          <span
            className={`online-in-chat-info ${
              friendsOnlineState.list[friendState.id] && friendState.areFriends
                ? "active"
                : ""
            }`}
          ></span>
        ) : null}
      </div>
      <h2>
        {friendState.groupData && friendState.groupData.isGroup
          ? friendState.groupData.group_name
          : friendState.username}
      </h2>
      <p>
        {friendState.groupData && friendState.groupData.isGroup
          ? `Group - ${friendState.members.length} members.`
          : friendState.email}
      </p>

      <div id="files-chat-ctn" onClick={notify}>
        <h3>Files</h3>
        <div id="files-ctn">
          <p>This feature is not yet available.</p>
        </div>
      </div>

      {friendState.groupData && friendState.groupData.isGroup ? (
        <>
          <ul id="member-list-info-chat">
            <h3>members</h3>
            <li>
              <div
                className="photo"
                style={{
                  "--p": `url("${
                    friendState.me.imgUrl || "/profile-img.jpg"
                  }")`,
                }}
              ></div>
              <div>
                <div>
                  <p>You</p>
                  {friendState.me.isLeader ? (
                    <p className="admin">Admin</p>
                  ) : null}
                </div>
                <p>{`User ID: ${friendState.me.id}`}</p>
              </div>
            </li>
            {friendState.members.map((item, index) => (
              <li key={index} onClick={() => handleClick(item)}>
                <div
                  className="photo"
                  style={{
                    "--p": `url("${item.imgUrl || "/profile-img.jpg"}")`,
                  }}
                >
                  {setIcon(item)}
                </div>
                <div>
                  <div>
                    <p>{item.username}</p>
                    {item.isLeader ? <p className="admin">Admin</p> : null}
                  </div>
                  <p>{`User ID: ${item.id}`}</p>
                </div>
              </li>
            ))}
          </ul>
          <GroupMemberMenu />
        </>
      ) : null}

      {friendState.areFriends ? (
        <button
          onClick={
            friendState.groupData && friendState.groupData.isGroup
              ? null
              : handleDeleteFriend
          }
        >
          <PiUserCircleMinusBold className="info-action-icon" />
          {friendState.groupData && friendState.groupData.isGroup
            ? "Get out of this group"
            : "Delete from your friend list"}
        </button>
      ) : (
        <button onClick={handleLeaveChat}>
          <PiUserCircleMinusBold className="info-action-icon" />
          {friendState.groupData && friendState.groupData.isGroup
            ? "Delete group"
            : "Leave the chat"}
        </button>
      )}
    </div>
  );
}

export default infoChat;
