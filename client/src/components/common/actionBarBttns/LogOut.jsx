import axios from "axios";

import { useNavigate } from "react-router-dom";
import { RiLogoutCircleRLine } from "react-icons/ri";

import socket from "../../../io";

function LogOut() {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await axios.delete("http://localhost:3000/logOut", {
      withCredentials: true,
    });
    navigate("/login");
    socket.disconnect();
  };

  return (
    <RiLogoutCircleRLine className="log-out-icon" onClick={handleLogOut} />
  );
}

export default LogOut;
