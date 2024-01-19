import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { setMember } from "../../../app/groupMemberMenuSlice";
import { activateInfo } from "../../../app/infoSlice";
import { changeChatState } from "../../../app/chatSlice";
import {
  useCancelFriendRequestMutation,
  useSendFriendRequestMutation,
} from "../../../app/queries/getFriendList";
import { useAcceptFrienRequestMutation } from "../../../app/queries/friendRequestApi";

import matchFriendRequets from "../../../utils/matchFriendRequests";
import socket from "../../../io";

function GroupMemberMenu() {
  const { open, userData } = useSelector((state) => state.groupMemberMenuState);
  const userState = useSelector((state) => state.userState);

  const dispatch = useDispatch();

  const [sendFriendRequest, result] = useSendFriendRequestMutation();
  const [cancelFriendRequest] = useCancelFriendRequestMutation();
  const [acceptFriendRequest] = useAcceptFrienRequestMutation();

  const handleClick = () => {
    dispatch(setMember({ open: false, userData: { username: "" } }));
  };

  const handleChat = () => {
    dispatch(
      changeChatState({
        active: true,
        conversationId: userData.conversationId,
        userId: userData.userId,
      })
    );
    dispatch(activateInfo(false));
  };

  const handleSendFriendRequest = () => {
    sendFriendRequest({ sender: userState.id, reciever: userData.userId });
    socket.emit("client:newFriendRequest", { id: userData.userId });
    socket.emit("client:updateChat", { id: userState.id });
  };

  const handleDeleteFriendRequest = () => {
    cancelFriendRequest({
      sender: userState.id,
      reciever: userData.userId,
    });
    socket.emit("client:newFriendRequest", { id: userData.userId });
    socket.emit("client:updateChat", { id: userState.id });
  };

  useEffect(() => {
    matchFriendRequets(acceptFriendRequest, result);
  }, [result]);

  return (
    <div
      id="groupMemberModal"
      className={`${open ? "active" : ""}`}
      onClick={handleClick}
    >
      <div>
        {userData.areFriends ? (
          <button
            onClick={handleChat}
          >{`Chat with ${userData.username}`}</button>
        ) : (
          <button
            onClick={
              !userData.pendingFriendRequest
                ? handleSendFriendRequest
                : handleDeleteFriendRequest
            }
          >
            {!userData.pendingFriendRequest
              ? `Send a friend request to ${userData.username}`
              : `Delete sent friend request`}
          </button>
        )}
      </div>
    </div>
  );
}

export default GroupMemberMenu;
