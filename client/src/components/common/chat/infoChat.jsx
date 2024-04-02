import { IoIosArrowBack } from "react-icons/io";
import { PiUserCircleMinusBold } from "react-icons/pi";
import { FaUserFriends, FaArrowRight } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { activateInfo } from "../../../app/infoSlice";
import { changeChatState } from "../../../app/chatSlice";
import { setMember } from "../../../app/groupMemberMenuSlice";
import { setEditGroupDataState } from "../../../app/editGroupDataSlice.js";

import { notify } from "../../../utils/notify.js";
import socket from "../../../io";
import axios from "axios";

import {
  useDeleteOfFriendListMutation,
  useGetOutOfChatMutation,
} from "../../../app/queries/getFriendList";
import { useLeaveGroupMutation } from "../../../app/queries/getMessages.js";

import GroupMemberMenu from "./GroupMemberMenu.jsx";
import EditGroupData from "./EditGroupData.jsx";

function infoChat() {
  const ctn = useRef(null);
  const nav = useRef(null);

  const [imgView, setImgView] = useState(false);
  const [navDown, setNavDown] = useState(false);

  const infoState = useSelector((state) => state.infoState);
  const friendState = useSelector((state) => state.friendState);
  const userState = useSelector((state) => state.userState);
  const friendsOnlineState = useSelector((state) => state.friendsOnlineState);
  const { open } = useSelector((state) => state.groupMemberMenuState);
  const { open: openEditGroupData } = useSelector(
    (state) => state.editGroupDataState
  );

  const dispatch = useDispatch();
  const [deleteOfFriendList] = useDeleteOfFriendListMutation();
  const [getOutOfChat, getOutOfChatRes] = useGetOutOfChatMutation();
  const [leaveGroup] = useLeaveGroupMutation();

  const handleDeleteFriend = () => {
    deleteOfFriendList({
      userId: userState.id,
      friendId: friendState.id,
      conversationId: friendState.conversationId,
    });

    socket.emit("client:reloadApp", {
      users: [userState.id, friendState.id].flat(),
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

  const handleLeaveGroup = () => {
    leaveGroup({
      userId: userState.id,
      conversationId: friendState.conversationId,
      eventMssg: `${userState.username} has left the group`,
    });

    const members = friendState.members.map((item) => item.id);

    socket.emit("client:reloadChat", {
      users: [userState.id, members].flat(),
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
        isAdmin: friendState.me.isLeader,
      })
    );
  };

  const handleChangePhoto = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("conversationId", friendState.conversationId);
    formData.append("username", userState.username);
    formData.append("image", file);

    try {
      await axios.put("http://localhost:3000/changeGroupPhoto", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
    } catch (error) {
      return console.log(error);
    }

    const keys = Object.keys(friendsOnlineState.list).map((item) =>
      parseInt(item)
    );

    socket.emit("client:reloadApp", { users: [keys, userState.id].flat() });
  };

  const setButton = () => {
    if (friendState.areFriends) {
      return (
        <button
          onClick={
            friendState.groupData && friendState.groupData.isGroup
              ? null
              : handleDeleteFriend
          }
        >
          <PiUserCircleMinusBold className="info-action-icon" />
          Delete from your friend list
        </button>
      );
    } else if (friendState.groupData && !friendState.groupData.isGroup) {
      return (
        <button onClick={handleLeaveChat}>
          <PiUserCircleMinusBold className="info-action-icon" />
          Leave the chat
        </button>
      );
    } else {
      return (
        <button onClick={handleLeaveGroup}>
          <PiUserCircleMinusBold className="info-action-icon" />
          Get out of this group
        </button>
      );
    }
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

  useEffect(() => {
    if (getOutOfChatRes.isError && getOutOfChatRes.originalStatus !== 200) {
      console.log(getOutOfChatRes.error);
      console.log(getOutOfChatRes);
    }
  }, [getOutOfChatRes]);

  // useEffect(() => {
  //   console.log(friendState);
  // }, [friendState]);

  return (
    <div
      id="info-chat-ctn"
      ref={ctn}
      className={`${infoState.active ? "active" : ""} ${open ? "open" : ""} ${
        imgView || openEditGroupData ? "not-scroll" : ""
      }`}
    >
      {!imgView ? (
        <IoIosArrowBack
          id="close-chat-info"
          onClick={() => dispatch(activateInfo(false))}
        />
      ) : null}
      <div
        id="img-ctn"
        className={imgView ? "view" : ""}
        onClick={(e) =>
          imgView && e.target != nav.current ? setNavDown(!navDown) : null
        }
      >
        {imgView ? (
          <>
            <div className={`nav ${navDown ? "active" : ""}`} ref={nav}>
              <IoIosArrowBack
                id="close-chat-info"
                onClick={() => {
                  setImgView(false);
                  setNavDown(false);
                }}
              />
              {friendState.me && friendState.me.isLeader ? (
                <>
                  <input
                    type="file"
                    name="group-photo"
                    id="group-photo"
                    accept="image/jpeg, image/png, image/jpg, image/webp, image/gif"
                    onChange={handleChangePhoto}
                  />
                  <label
                    htmlFor={
                      friendState.me && friendState.me.isLeader
                        ? "group-photo"
                        : ""
                    }
                  >
                    <MdEdit className="icon" />
                  </label>
                </>
              ) : null}
            </div>
            <img
              src={
                friendState.groupData && friendState.groupData.isGroup
                  ? `${friendState.groupData.img_url || "/group-photo.jpg"}`
                  : `${friendState.imgUrl || "/profile-img.jpg"}`
              }
              alt="user photo"
            />
          </>
        ) : (
          <div
            className="photo"
            onClick={() => {
              ctn.current.scrollTop = 0;
              setImgView(true);
            }}
            style={{
              "--p":
                friendState.groupData && friendState.groupData.isGroup
                  ? `url("${
                      friendState.groupData.img_url || "/group-photo.jpg"
                    }")`
                  : `url("${friendState.imgUrl || "/profile-img.jpg"}")`,
            }}
          >
            {friendState.groupData && !friendState.groupData.isGroup ? (
              <span
                className={`online-in-chat-info ${
                  friendsOnlineState.list[friendState.id] &&
                  friendState.areFriends
                    ? "active"
                    : ""
                }`}
              ></span>
            ) : null}
          </div>
        )}
      </div>
      <h2>
        {friendState.groupData && friendState.groupData.isGroup ? (
          <>
            {friendState.groupData.group_name}
            {friendState.me && friendState.me.isLeader ? (
              <MdEdit
                className="icon"
                onClick={() => {
                  ctn.current.scrollTop = 0;
                  dispatch(setEditGroupDataState({ open: true, type: "name" }));
                }}
              />
            ) : null}
          </>
        ) : (
          friendState.username
        )}
      </h2>
      {friendState.groupData && friendState.groupData.isGroup ? (
        <>
          <p>
            {`
            Group - ${
              friendState.members.filter((item) => !item.leftGroupAt).length +
              (friendState.me.leftGroupAt ? 0 : 1)
            } members.`}
          </p>
          <div
            className="description"
            onClick={() => {
              if (friendState.me && friendState.me.isLeader) {
                ctn.current.scrollTop = 0;
                dispatch(
                  setEditGroupDataState({ open: true, type: "description" })
                );
              }
            }}
          >
            {friendState.groupData.group_description
              .split(`\n`)
              .map((item, index) =>
                item ? <p key={index}>{item}</p> : <br key={index} />
              )}

            {friendState.me && friendState.me.isLeader ? (
              <MdEdit className="icon" />
            ) : null}
          </div>
        </>
      ) : (
        <div className="space"></div>
      )}

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
            {!friendState.me.leftGroupAt ? (
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
            ) : null}
            {friendState.members.map((item, index) =>
              !item.leftGroupAt ? (
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
              ) : null
            )}
          </ul>
          <GroupMemberMenu />
        </>
      ) : null}

      {setButton()}

      <EditGroupData />
    </div>
  );
}

export default infoChat;
