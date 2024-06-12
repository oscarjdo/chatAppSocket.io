import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatCtn, FriendNavBar, InfoChat, InputCtn } from "./common/chat/";
import ChatOptions from "./common/chat/chatOptions.jsx";
import Loader from "./common/loader/Loader";

import { useGetMessagesQuery } from "../app/queries/getMessages";
import { setFriendData } from "../app/friendSlice";

import scrollToBottom from "../utils/scroolToBottom";
import socket from "../io";
import Modal from "./common/chat/Modal";
import FriendListMenu from "./common/chat/FriendListMenu.jsx";

function Chat() {
  const chatState = useSelector((state) => state.chatState);
  const userState = useSelector((state) => state.userState);

  const { data, error, isError, isLoading, isSuccess, refetch } =
    useGetMessagesQuery({
      userId: userState.id,
      conversationId: chatState.conversationId,
    });

  const dispatch = useDispatch();

  const update = () => {
    setTimeout(() => {
      refetch();
    }, 100);
  };

  useEffect(() => {
    if (isError) console.log(error);
    if (isSuccess) {
      dispatch(setFriendData(data));
      scrollToBottom();

      if (chatState.scrollTo) {
        setTimeout(() => {
          let element = document.getElementById(chatState.scrollTo);

          element.scrollIntoView();
        }, 800);
      }
    }
    socket.on("server:reloadApp", update);
    socket.on("server:reloadChat", update);
  }, [socket, data]);

  useEffect(() => {
    if (data) refetch();
  }, [chatState.open]);

  return (
    <div id="chat-ctn" className={chatState.open ? "in-chat" : null}>
      <FriendNavBar />
      <ChatCtn />
      {isLoading ? <Loader /> : null}
      <InputCtn />
      <InfoChat />
      <ChatOptions />
      <Modal />
      <FriendListMenu />
    </div>
  );
}

export default Chat;
