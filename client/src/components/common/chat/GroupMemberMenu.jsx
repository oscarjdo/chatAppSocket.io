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
import { useLeaveGroupMutation } from "../../../app/queries/getMessages";

import matchFriendRequets from "../../../utils/matchFriendRequests";
import socket from "../../../io";

function GroupMemberMenu() {
  const { open, userData, isAdmin } = useSelector(
    (state) => state.groupMemberMenuState
  );
  const userState = useSelector((state) => state.userState);
  const friendState = useSelector((state) => state.friendState);

  const dispatch = useDispatch();

  const [sendFriendRequest, result] = useSendFriendRequestMutation();
  const [cancelFriendRequest] = useCancelFriendRequestMutation();
  const [acceptFriendRequest] = useAcceptFrienRequestMutation();
  const [leaveGroup] = useLeaveGroupMutation();

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
    socket.emit("client:reloadChat", { users: [userState.id] });
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

  const handleRemoveFromChat = () => {
    leaveGroup({
      userId: userData.userId,
      conversationId: userData.conversationId,
      eventMssg: `${userState.username} has removed ${userData.username} from the group`,
    });

    const members = friendState.members.map((item) => item.id);

    socket.emit("client:reloadApp", {
      users: [members || [friendState.id], userState.id].flat(),
    });
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
        {isAdmin ? (
          <button
            onClick={handleRemoveFromChat}
          >{`Remove ${userData.username} from the group`}</button>
        ) : null}
      </div>
    </div>
  );
}

export default GroupMemberMenu;
