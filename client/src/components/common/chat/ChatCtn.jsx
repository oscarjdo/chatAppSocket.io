import { useEffect } from "react";
import { useSelector } from "react-redux";

import scrollToBottom from "../../../utils/scroolToBottom.js";

import Message from "./Message.jsx";

function ChatCtn() {
  const chatState = useSelector((state) => state.chatState);
  const friendState = useSelector((state) => state.friendState);

  useEffect(() => {
    scrollToBottom();
  }, [chatState]);

  let day = null;

  return (
    <div id="chat-mssg-ctn">
      <ul>
        {friendState.messages.map((item, index) => {
          return <Message key={index} data={{ item, index, day }} />;
        })}
      </ul>
    </div>
  );
}

export default ChatCtn;
