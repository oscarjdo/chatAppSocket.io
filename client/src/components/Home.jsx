import FriendList from "./friendList";
import Chat from "./Chat";
import ActionsBar from "./ActionsBar";
import AddFriendModeTransition from "./common/loader/addFriendModeTransition.jsx";
import FriendRequests from "./common/FriendRequests";
import Options from "./common/actionBarBttns/options/Options.jsx";
import OptionsMenu from "./common/actionBarBttns/OptionsMenu.jsx";

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
        if (key == item.members.userId) {
          onlineUserList[item.members.userId] = true;
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
    // socket.on("server:updateFriendList", (e) => {
    //   setTimeout(() => {
    //     handleOnline(e);
    //   }, 600);
    // });
  }, [socket]);

  return (
    <div id="chat-app-ctn">
      <ActionsBar />
      <FriendList />
      <OptionsMenu />
      <Chat />
      <FriendRequests />
      <AddFriendModeTransition />
      <Options />
    </div>
  );
}

export default Home;
