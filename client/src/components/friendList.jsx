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

import getTime from "../utils/getTime.js";
import { notify } from "../utils/notify.js";
import socket from "../io.js";

import Loader from "./common/loader/Loader.jsx";

function friendList() {
  const userState = useSelector((state) => state.userState);
  const addFriendModeState = useSelector((state) => state.addFriendModeState);
  const friendsOnlineState = useSelector((state) => state.friendsOnlineState);

  const dispatch = useDispatch();
  const [sendFriendRequest] = useSendFriendRequestMutation();
  const [cancelFriendRequest] = useCancelFriendRequestMutation();

  const handleOpenChat = (friendId) => {
    dispatch(changeChatState({ active: true, friendId }));
  };

  const handleClickPlus = (friend) => {
    sendFriendRequest({ sender: userState.id, reciever: friend.id });
    socket.emit("client:newFriendRequest", { id: friend.id });
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
    socket.emit("client:newFriendRequest", { id: friend.id });
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

    socket.on("server:recieveMssg", () =>
      !addFriendModeState.open ? update() : null
    );
    socket.on("server:updateFriendList", () =>
      !addFriendModeState.open ? update() : null
    );
    socket.on("server:hasBeenDeleted", () =>
      !addFriendModeState.open ? update() : null
    );
    socket.on("server:photoChanged", (e) =>
      e !== userState.id ? update() : null
    );
  }, [socket, data]);

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
              ? new Date(item.lastMessage.sent_date)
              : false;

            return (
              <li
                key={index}
                className="user-ctn"
                onClick={() =>
                  !addFriendModeState.open
                    ? handleOpenChat(item.friend_id)
                    : null
                }
              >
                <div className="friend-list-photo-ctn">
                  <div
                    className="photo"
                    style={{
                      "--p": item.imgUrl
                        ? `url("${item.imgUrl}")`
                        : "url('/profile-img.jpg')",
                    }}
                  ></div>
                </div>
                <div className="text-ctn">
                  <h4>{item.friend}</h4>
                  <div className="p-ctn">
                    {itemDate && item.lastMessage.sender == userState.id ? (
                      <>
                        <BiCheckDouble
                          className={`chat-icon preview ${
                            item.lastMessage.message_read ? "read" : ""
                          }`}
                        />
                      </>
                    ) : null}
                    <p>
                      {addFriendModeState.open ? `User ID: ${item.id}` : ""}
                      {itemDate ? item.lastMessage.content : null}
                    </p>
                  </div>
                </div>
                {!addFriendModeState.open ? (
                  <span
                    className={
                      friendsOnlineState.list[item.friend_id] && item.areFriends
                        ? "isOnline online"
                        : "online"
                    }
                  ></span>
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
                {itemDate ? (
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
