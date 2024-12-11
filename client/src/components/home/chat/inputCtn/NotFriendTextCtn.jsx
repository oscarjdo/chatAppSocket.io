import React from "react";
import { useSelector } from "react-redux";

import { changeChatState } from "../../../../app/chatSlice";
import { useGetOutOfChatMutation } from "../../../../app/queries/getFriendList";

function NotFriendTextCtn() {
  const userState = useSelector((state) => state.userState);
  const friendState = useSelector((state) => state.friendState);

  const [getOutOfChat] = useGetOutOfChatMutation();

  const handleLeaveChat = () => {
    getOutOfChat({
      userId: userState.id,
      conversationId: friendState.conversationId,
    });

    setTimeout(() => {
      dispatch(changeChatState({ active: false }));
    }, 500);
  };

  return (
    <div id="input-chat-ctn" className="disabled">
      <div>
        <h2 id="is-not-friend-text">
          {friendState.groupData && friendState.groupData.isGroup
            ? "You are not a group member anymore"
            : "This user is not your friend anymore"}
        </h2>
        <p id="delete-text">
          Do you want to <span onClick={handleLeaveChat}>Leave the chat</span>?
        </p>
      </div>
    </div>
  );
}

export default NotFriendTextCtn;
