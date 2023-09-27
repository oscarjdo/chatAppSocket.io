import { io } from "socket.io-client";

let socket = io("http://localhost:3000", { withCredentials: true });

export default socket;
