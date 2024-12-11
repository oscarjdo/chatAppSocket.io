import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import FriendList from "./home/friendList";
import Chat from "./home/Chat";
import ActionsBar from "./home/ActionsBar";
import Options from "./home/Options.jsx";
import OptionsMenu from "./home/OptionsMenu.jsx";
import FriendRequests from "./home/FriendRequests";
import AddFriendModeTransition from "./common/addFriendModeTransition.jsx";

import { setFriendsOnline } from "../app/friendsOnlineSlice";

import socket from "../io.js";
import axios from "axios";

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
  }, [socket]);

  return (
    <div id="chat-app-ctn">
      <ActionsBar />
      <FriendList />
      <OptionsMenu />
      <Chat />
      <FriendRequests />
      {/* <AddFriendModeTransition /> */}
      <Options />
    </div>
  );
}

export default Home;
