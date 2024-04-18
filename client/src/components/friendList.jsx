import { useEffect } from "react";
import { BiCheckDouble } from "react-icons/bi";
import { PiUserCirclePlusBold } from "react-icons/pi";
import { TbUserCancel } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { changeChatState } from "../app/chatSlice.js";

import {
  useGetFriendListQuery,
  useSendFriendRequestMutation,
  useCancelFriendRequestMutation,
} from "../app/queries/getFriendList.js";
import { useAcceptFrienRequestMutation } from "../app/queries/friendRequestApi.js";

import getTime from "../utils/getTime.js";
import { notify } from "../utils/notify.js";
import matchFriendRequets from "../utils/matchFriendRequests.js";
import socket from "../io.js";

import Loader from "./common/loader/Loader.jsx";

function friendList() {
  const userState = useSelector((state) => state.userState);
  const addFriendModeState = useSelector((state) => state.addFriendModeState);
  const friendsOnlineState = useSelector((state) => state.friendsOnlineState);

  const dispatch = useDispatch();
  const [sendFriendRequest, result] = useSendFriendRequestMutation();
  const [cancelFriendRequest] = useCancelFriendRequestMutation();
  const [acceptFriendRequest] = useAcceptFrienRequestMutation();

  const handleOpenChat = (conversationId, userId) => {
    dispatch(changeChatState({ active: true, conversationId, userId }));
  };

  const handleClickPlus = (friend) => {
    sendFriendRequest({ sender: userState.id, reciever: friend.id });
    socket.emit("client:reloadFriendRequests", { user: friend.id });
    notify({
      type: "success",
      mssg: `You have sent a friend request to ${friend.friend}`,
    });
  };

  const handleClickCancel = (friend) => {
    cancelFriendRequest({
      sender: userState.id,
      reciever: friend.id,
    });
    socket.emit("client:reloadFriendRequests", { user: friend.id });
    notify({
      type: "warning",
      mssg: `You have canceled ${friend.friend}'s friend request.`,
    });
  };

  const { data, error, isError, isLoading, isSuccess, refetch } =
    useGetFriendListQuery(
      !addFriendModeState.open
        ? `/getFriendList/${userState.id}`
        : `getUserList/${userState.id}`
    );

  if (isError) {
    console.log(error);
  }

  useEffect(() => {
    const update = () => {
      setTimeout(() => {
        refetch();
      }, 500);
    };

    socket.on("server:reloadApp", () => update());
  }, [socket, data]);

  useEffect(() => {
    matchFriendRequets(acceptFriendRequest, result);
  }, [result]);

  // useEffect(() => {
  //   if (isError) console.log(error);
  //   if (data) console.log(data);
  // }, [data]);

  return (
    <div id="friends-ctn">
      <ul id="user-list">
        {addFriendModeState.open ? (
          <h2 id="add-friend-mode-text">Add a new friend.</h2>
        ) : null}
        {isLoading ? <Loader /> : null}
        {isSuccess && data.length > 0 ? (
          data.map((item, index) => {
            const itemDate = item.lastMessage
              ? new Date(item.lastMessage.sentDate)
              : false;

            const setImg = () => {
              if (item.isGroup)
                return `url("${item.groupImg || "/group-photo.jpg"}")`;

              if (item.members && item.members.imgUrl)
                return `url("${item.members.imgUrl}")`;

              if (item.imgUrl) return `url("${item.imgUrl}")`;

              return `url("/profile-img.jpg")`;
            };

            const generateText = () => {
              if (item.lastMessage.isEvent) {
                const { username, newPhoto, text } = JSON.parse(
                  item.lastMessage.content
                );

                return newPhoto
                  ? `${username} has changed the group photo`
                  : text;
              } else {
                return item.lastMessage.content;
              }
            };

            const setFileType = () => {
              let text = item.lastMessage.mimetype;
              text = text[0].toUpperCase().concat(text.slice(1));

              const icon = {
                Image: "📷",
                Audio: "🔉",
                Video: "🎬",
                Document: "📃",
              };

              return `${icon[text]}${text}${
                item.lastMessage.content ? " - " : ""
              }`;
            };

            return (
              <li
                key={index}
                className="user-ctn"
                onClick={() =>
                  !addFriendModeState.open
                    ? handleOpenChat(item.conversationId, item.members.userId)
                    : null
                }
              >
                <div className="friend-list-photo-ctn">
                  <div
                    className="photo"
                    style={{
                      "--p": setImg(),
                    }}
                  ></div>
                </div>
                <div className="text-ctn">
                  <h4>
                    {item.friend || item.members.username || item.groupName}
                  </h4>
                  <div className="p-ctn">
                    {itemDate && item.lastMessage.sender == userState.id ? (
                      <>
                        <BiCheckDouble
                          className={`chat-icon preview ${
                            item.lastMessage.messageRead ? "read" : ""
                          }`}
                        />
                      </>
                    ) : null}
                    <p>
                      {addFriendModeState.open ? `User ID: ${item.id}` : ""}
                      {itemDate ? (
                        <>
                          {item.lastMessage.mimetype ? setFileType() : null}
                          {generateText()}
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>
                {!addFriendModeState.open ? (
                  !item.isGroup ? (
                    <span
                      className={
                        item.members &&
                        friendsOnlineState.list[item.members.userId] &&
                        item.areFriends
                          ? "isOnline online"
                          : "online"
                      }
                    ></span>
                  ) : null
                ) : (
                  <>
                    {item.sentRequest ? (
                      <TbUserCancel
                        className="icon-add icon-cancel"
                        onClick={() => handleClickCancel(item)}
                      />
                    ) : (
                      <PiUserCirclePlusBold
                        className="icon-add icon-plus"
                        onClick={() => handleClickPlus(item)}
                      />
                    )}
                  </>
                )}
                {itemDate && item.lastMessage.content ? (
                  <p className="mssg-hour">{getTime(itemDate)}</p>
                ) : null}
              </li>
            );
          })
        ) : (
          <p id="friend-empty-text">Add new friends!</p>
        )}
      </ul>
    </div>
  );
}

export default friendList;
