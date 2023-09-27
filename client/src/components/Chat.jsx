import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatCtn, FriendNavBar, InfoChat, InputCtn } from "./common/chat/";
import Loader from "./common/loader/Loader";

import { useGetMessagesQuery } from "../app/queries/getMessages";
import { setFriendData } from "../app/friendSlice";

import scrollToBottom from "../utils/scroolToBottom";
import socket from "../io";

function Chat() {
  const chatState = useSelector((state) => state.chatState);
  const userState = useSelector((state) => state.userState);

  const { data, error, isError, isLoading, isSuccess, refetch } =
    useGetMessagesQuery({
      userId: userState.id,
      friendId: chatState.friendId,
    });

  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) console.log(error);
    if (isSuccess) dispatch(setFriendData(data));
    if (data && !data.areFriends) refetch();
    scrollToBottom();
  }, [data]);

  useEffect(() => {
    const update = () => {
      setTimeout(() => {
        refetch();
      }, 100);
    };

    socket.on("server:recieveMssg", () => update());
    socket.on("server:hasBeenDeleted", () => update());
    socket.on("server:photoChanged", (e) =>
      (e === chatState.friendId || !chatState.open) && e !== userState.id
        ? update()
        : null
    );
  }, [socket, data]);

  return (
    <div id="chat-ctn" className={chatState.open ? "in-chat" : null}>
      <FriendNavBar />
      <ChatCtn />
      {isLoading ? <Loader /> : null}
      <InputCtn />
      <InfoChat />
    </div>
  );
}

export default Chat;
