import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Message from "./chatCtn/Message.jsx";
import Loader from "../../common/Loader.jsx";

import { setIsScrolling } from "../../../app/isScrollingSlice.js";

import scrollToBottom from "../../../utils/scroolToBottom.js";

function ChatCtn() {
  let { current: scrollingTimeout } = useRef(null);
  let { current: sender } = useRef(null);

  const [touchStart, setTouchStart] = useState(false);
  const [colorList, setColorList] = useState({});
  const [colorsIndex, setColorsIndex] = useState(0);
  const colors = [
    "#a867d3",
    "#f36d4c",
    "#00eeb2",
    "#ee3800",
    "#eea300",
    "#5179ff",
    "#db5c78",
    "#7adb5c",
  ];

  const chatState = useSelector((state) => state.chatState);
  const friendState = useSelector((state) => state.friendState);
  const replyMessageState = useSelector((state) => state.replyMessageState);

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
      className={replyMessageState.open ? "replyMessage" : ""}
    >
      <ul>
        {friendState.messages.map((item, index) => {
          if (!colorList[item.sender]) {
            setColorList({
              ...colorList,
              [item.sender]: colors[colorsIndex],
            });

            if (!colors[colorsIndex]) {
              setColorsIndex(0);
            } else {
              setColorsIndex(colorsIndex + 1);
            }
          }

          let space = undefined;

          if (item.sender != sender) {
            space = true;
            sender = item.sender;
          }
          if (sender == null) sender = item.sender;

          return (
            <Message key={index} data={{ item, index, space, colorList }} />
          );
        })}
      </ul>
    </div>
  );
}

export default ChatCtn;
