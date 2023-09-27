import FriendList from "./friendList";
import Chat from "./Chat";
import ActionsBar from "./ActionsBar";
import AddFriendModeTransition from "./common/loader/addFriendModeTransition.jsx";
import FriendRequests from "./common/FriendRequests";
import UserInfo from "./common/actionBarBttns/settings/UserInfo";

import { setFriendsOnline } from "../app/friendsOnlineSlice";
import socket from "../io.js";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function Home() {
  const userState = useSelector((state) => state.userState);

  const dispatch = useDispatch();

  const handleOnline = async (e) => {
    const { data } = await axios.get(
      `http://localhost:3000/getFriendList/${userState.id}`
    );

    let onlineUserList = {};

    data.forEach((item) => {
      for (const key in e) {
        if (key == item.friend_id) {
          onlineUserList[item.friend_id] = true;
        }
      }
    });

    dispatch(setFriendsOnline(onlineUserList));
  };

  useEffect(() => {
    if (userState.id) {
      socket.emit("client:userId", userState.id);
    }

    socket.on("server:usersOnline", (e) => handleOnline(e));
    socket.on("server:updateFriendList", (e) => {
      setTimeout(() => {
        handleOnline(e);
      }, 600);
    });
  }, [socket]);

  return (
    <div id="chat-app-ctn">
      <ActionsBar />
      <FriendList />
      <Chat />
      <FriendRequests />
      <AddFriendModeTransition />
      <UserInfo />
    </div>
  );
}

export default Home;
