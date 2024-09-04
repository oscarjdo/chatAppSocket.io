import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ChatCtn,
  ChatOptions,
  FriendListMenu,
  FriendNavBar,
  InfoChat,
  InputCtn,
  Modal,
} from "./chat/index.jsx";

import { useGetMessagesQuery } from "../../app/queries/getMessages";
import { setFriendData } from "../../app/friendSlice";
import { setScrollToState } from "../../app/scrollToSlice.js";

import scrollToBottom from "../../utils/scroolToBottom";
import socket from "../../io";
import axios from "axios";

function Chat() {
  const chatState = useSelector((state) => state.chatState);
  const scrollToState = useSelector((state) => state.scrollToState);
  const userState = useSelector((state) => state.userState);

  const { data, error, isError, isLoading, isSuccess, refetch } =
    useGetMessagesQuery({
      userId: userState.id,
      conversationId: chatState.conversationId,
    });

  const dispatch = useDispatch();

  const update = () => {
    setTimeout(() => {
      if (!isLoading && isSuccess && data) refetch();
    }, 100);
  };

  const setReadMessages = async () => {
    if (data.groupData.isGroup) return;

    try {
      await axios.put("http://localhost:3000/setReadMessages", {
        conversationId: chatState.conversationId,
        userId: data.friend.id,
      });

      socket.emit("client:reloadApp", {
        users: [data.friend.id],
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isError) console.log(error);
    if (isSuccess) {
      dispatch(setFriendData(data));
      scrollToBottom();

      if (data.groupData && data.groupData.notReadMessage) setReadMessages();
    }
    socket.on("server:reloadApp", update);
    socket.on("server:reloadChat", update);

    return () => {
      socket.off("server:reloadApp");
      socket.off("server:reloadChat");
    };
  }, [socket, data]);

  useEffect(() => {
    if (scrollToState.to) {
      setTimeout(() => {
        let element = document.getElementById(scrollToState.to);

        element.scrollIntoView();

        element.classList.add("glowing");

        setTimeout(() => {
          element.classList.remove("glowing");
        }, 1200);

        dispatch(setScrollToState(``));
      }, scrollToState.time);
    }
  }, [scrollToState.to]);

  useEffect(() => {
    if (data) refetch();
  }, [chatState.open]);

  // useEffect(() => {
  //   if (!isLoading) {
  //     console.log("stop loading");
  //   }
  // }, [isLoading]);

  return (
    <div
      id="chat-ctn"
      className={chatState.open && !isLoading && isSuccess ? "in-chat" : null}
    >
      <FriendNavBar />
      <ChatCtn />
      <InputCtn />
      <InfoChat />
      <ChatOptions />
      <Modal />
      <FriendListMenu />
    </div>
  );
}

export default Chat;
