import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Message from "./Message.jsx";

import { setIsScrolling } from "../../../app/isScrollingSlice.js";

import scrollToBottom from "../../../utils/scroolToBottom.js";

function ChatCtn() {
  const chatState = useSelector((state) => state.chatState);
  const friendState = useSelector((state) => state.friendState);

  const dispatch = useDispatch();

  useEffect(() => {
    scrollToBottom();
  }, [chatState]);

  let scrollingTimeout;

  const handleScroll = () => {
    dispatch(setIsScrolling(true));

    if (scrollingTimeout) {
      clearTimeout(scrollingTimeout);
    }

    scrollingTimeout = setTimeout(() => {
      dispatch(setIsScrolling(false));
    }, 500);
  };

  let day = null;

  return (
    <div id="chat-mssg-ctn" onScroll={handleScroll}>
      <ul>
        {friendState.messages.map((item, index) => {
          return <Message key={index} data={{ item, index, day }} />;
        })}
      </ul>
    </div>
  );
}

export default ChatCtn;
