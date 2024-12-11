import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getUserToken } from "./app/userSlice";
import { setSideMenusState } from "./app/sideMenusSlice";

import {
  Navbar,
  Home,
  Form,
  GalleryOrCamera,
  Camera,
  Noti,
  AvatarMenu,
} from "./components/";
import CircularLoader from "./components/common/CircularLoader";

import axios from "axios";
import socket from "./io";

function App() {
  const [firstFetch, setFirstFetch] = useState(false);

  const userState = useSelector((state) => state.userState);
  const { loged } = useSelector((state) => state.userState);
  const { type } = useSelector((state) => state.sideMenusState);

  const dispatch = useDispatch();

  const getToken = async () => {
    const { data } = await axios.get("http://localhost:3000/login", {
      withCredentials: true,
    });
    dispatch(getUserToken(data));
    setFirstFetch(true);
  };

  const handleCloseMenus = () => {
    type != null ? dispatch(setSideMenusState({})) : null;
  };

  useEffect(() => {
    getToken();
  }, [loged]);

  useEffect(() => {
    socket.on("server:restartToken", () => getToken());

    return () => {
      socket.off("server:restartToken");
    };
  }, [socket]);

  return (
    <div
      id="page-ctn"
      onClick={handleCloseMenus}
      onTouchMove={handleCloseMenus}
    >
      <CircularLoader loaded={firstFetch} />
      <Navbar />
      {userState.id ? <Home /> : <Form />}
      <GalleryOrCamera />
      <Camera />
      <Noti />
      <AvatarMenu />
    </div>
  );
}

export default App;
