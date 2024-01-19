import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

function Navbar() {
  const chatState = useSelector((state) => state.chatState);
  const userState = useSelector((state) => state.userState);

  return (
    <nav className={chatState.open ? "in-chat" : null}>
      {userState.id ? (
        <p>You online like</p>
      ) : (
        <p className="offline">Offline</p>
      )}
      <motion.p
        className="no-very-with"
        whileHover={{
          rotate: 10,
          scale: 1.1,
          textShadow: "0 0 10px #00fa68",
        }}
        transition={{ duration: 0.2 }}
      >
        <b>
          {userState.id
            ? userState.username[0].toUpperCase() + userState.username.slice(1)
            : ""}
        </b>
      </motion.p>
    </nav>
  );
}

export default Navbar;
