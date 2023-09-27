import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Navbar, Form, Home } from "./components/";
import ProtectPath from "./components/protectPath";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { getUserToken } from "./app/userSlice";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import socket from "./io";

function App() {
  const chatState = useSelector((state) => state.chatState);
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const getToken = async () => {
    const { data } = await axios.get("http://localhost:3000/login", {
      withCredentials: true,
    });
    dispatch(getUserToken(data));
  };

  useEffect(() => {
    getToken();
  }, [location.pathname]);

  useEffect(() => {
    socket.on("server:restartToken", () => getToken());
  }, [socket]);

  useEffect(() => {
    if (chatState.open) {
      setTimeout(() => {
        setOpen(chatState.open);
      }, 300);
    } else {
      setOpen(chatState.open);
    }
  }, [chatState]);

  return (
    <div id="page-ctn" className={open ? "in-chat" : null}>
      <Navbar />
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route element={<ProtectPath />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/login" element={<Form />} />
          <Route path="/signup" element={<Form />} />
        </Routes>
      </AnimatePresence>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark"
      />
    </div>
  );
}

export default App;
