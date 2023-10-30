import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Message from "./Message.jsx";

import { setIsScrolling } from "../../../app/isScrollingSlice.js";

import scrollToBottom from "../../../utils/scroolToBottom.js";

function ChatCtn() {
  let { current: day } = useRef(null);
  let { current: scrollingTimeout } = useRef(null);
  let { current: sender } = useRef(null);

  const [touchStart, setTouchStart] = useState(false);

  const chatState = useSelector((state) => state.chatState);
  const friendState = useSelector((state) => state.friendState);

  const dispatch = useDispatch();

  useEffect(() => {
    scrollToBottom();
  }, [chatState]);

  const handleScroll = () => {
    dispatch(setIsScrolling(true));

    if (scrollingTimeout) {
      clearTimeout(scrollingTimeout);
    }

    scrollingTimeout = setTimeout(() => {
      if (!touchStart) {
        dispatch(setIsScrolling(false));
      }
    }, 250);
  };

  const handleTouchStart = () => {
    setTouchStart(true);
  };

  const handleTouchEnd = () => {
    dispatch(setIsScrolling(false));
    setTouchStart(false);
  };

  return (
    <div
      id="chat-mssg-ctn"
      onScroll={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <ul>
        {friendState.messages.map((item, index) => {
          let space = false;

          if (sender == null) sender = item.sender;
          else if (item.sender != sender) {
            space = true;
            sender = item.sender;
          }

          return <Message key={index} data={{ item, index, day, space }} />;
        })}
      </ul>
    </div>
  );
}

export default ChatCtn;
