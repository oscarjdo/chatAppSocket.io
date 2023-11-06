import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatCtn, FriendNavBar, InfoChat, InputCtn } from "./common/chat/";
import Loader from "./common/loader/Loader";

import { useGetMessagesQuery } from "../app/queries/getMessages";
import { setFriendData } from "../app/friendSlice";

import scrollToBottom from "../utils/scroolToBottom";
import socket from "../io";
import Modal from "./common/chat/Modal";

function Chat() {
  const chatState = useSelector((state) => state.chatState);
  const userState = useSelector((state) => state.userState);

  const { data, error, isError, isLoading, isSuccess, refetch } =
    useGetMessagesQuery({
      userId: userState.id,
      friendId: chatState.friendId,
    });

  const dispatch = useDispatch();

  const update = () => {
    setTimeout(() => {
      refetch();
    }, 100);
  };

  useEffect(() => {
    if (isError) console.log(error);
    if (isSuccess) dispatch(setFriendData(data));
    scrollToBottom();

    socket.on("server:recieveMssg", () => update());
    socket.on("server:updateChat", () => update());
    socket.on("server:hasBeenDeleted", () => update());
    socket.on("server:photoChanged", (e) =>
      (e === chatState.friendId || !chatState.open) && e !== userState.id
        ? update()
        : null
    );
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
      <Modal />
    </div>
  );
}

export default Chat;
