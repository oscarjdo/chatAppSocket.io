import { useEffect } from "react";
import { BiCheckDouble } from "react-icons/bi";
import { PiUserCirclePlusBold } from "react-icons/pi";
import { TbUserCancel } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { changeChatState } from "../app/chatSlice.js";
import { setFriendListState } from "../app/friendListSlice.js";

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
import axios from "axios";

import Loader from "./common/loader/Loader.jsx";
import SetIcon from "./SetIcon.jsx";
import { MdDeleteForever } from "react-icons/md";

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

  const setFriendList = () => {
    if (addFriendModeState.open) return;

    const list = data
      .slice()
      .sort((a, b) =>
        !a.isGroup && !b.isGroup
          ? a.members.username
              .toUpperCase()
              .localeCompare(b.members.username.toUpperCase())
          : null
      )
      .filter((item) => !item.isGroup)
      .map((item) => ({
        userId: item.members.userId,
        username: item.members.username,
        imgUrl: item.members.imgUrl,
        conversationId: item.members.conversationId,
      }));

    dispatch(setFriendListState({ list }));
  };

  const setRecievedMessages = async () => {
    if (addFriendModeState.open) return;

    try {
      const hasNotRecievedMessages = data
        .filter(
          (item) =>
            item.lastMessage.sender !== userState.id &&
            !item.lastMessage.isEvent &&
            !item.lastMessage.message_recieved
        )
        .map((item) => ({
          conversationId: item.conversationId,
          membersId: item.members.userId,
        }));

      if (hasNotRecievedMessages.length >= 1) {
        await axios.put("http://localhost:3000/setRecievedMessages", {
          conversationsId: hasNotRecievedMessages.map(
            (item) => item.conversationId
          ),
        });

        socket.emit("client:reloadApp", {
          users: hasNotRecievedMessages.map((item) => item.membersId),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const update = () => {
      setTimeout(() => {
        if (isSuccess && !isLoading) refetch();
      }, 500);
    };

    socket.on("server:reloadApp", () => update());
  }, [socket, data]);

  useEffect(() => {
    matchFriendRequets(acceptFriendRequest, result);
  }, [result]);

  useEffect(() => {
    if (isError) console.log(error);
    if (data && isSuccess) {
      setFriendList();

      setRecievedMessages();
    }
  }, [data]);

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
              } else if (!item.lastMessage.is_show) {
                const setName = () =>
                  item.members.length
                    ? item.members.filter(
                        (it) => it.userId == item.lastMessage.sender
                      )[0].username
                    : item.members.username;

                return userState.id !== item.lastMessage.sender
                  ? `${setName()} has deleted this message.`
                  : "You have deleted this message";
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
                    {itemDate &&
                    item.lastMessage.sender == userState.id &&
                    !item.lastMessage.isEvent &&
                    !item.isGroup ? (
                      <>
                        <SetIcon item={item.lastMessage} />
                      </>
                    ) : null}
                    <p>
                      {!addFriendModeState.open &&
                      item.lastMessage &&
                      !item.lastMessage.isEvent &&
                      item.isGroup ? (
                        <span className="groupSenderText">
                          {item.lastMessage.sender != userState.id
                            ? item.members
                                .filter(
                                  (it) => it.userId == item.lastMessage.sender
                                )
                                .map((it) => it.username)
                            : "You"}
                          :&nbsp;
                        </span>
                      ) : null}
                      {addFriendModeState.open ? `User ID: ${item.id}` : ""}
                      {itemDate ? (
                        <>
                          {item.lastMessage.mimetype && item.lastMessage.is_show
                            ? setFileType()
                            : null}
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
                {item.notReadMessagesLength ? (
                  <span className="spanNotReadMessagesLength">
                    {item.notReadMessagesLength}
                  </span>
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
