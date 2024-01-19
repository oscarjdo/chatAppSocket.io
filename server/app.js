import express from "express";
import http from "http";
import { Server } from "socket.io";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { dirname, join } from "path";
import { fileURLToPath } from "url";

import routes from "./routes/index.js";

const env = process.env;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  },
});

const currentDir = dirname(fileURLToPath(import.meta.url));

config();
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(cors({ origin: env.ORIGIN }));
app.use(cookieParser());

// app.use(express.static(join(currentDir, "images")));
app.use(express.static("public"));
app.use(routes);

app.get("/", (req, res) => {
  res.json("hello world");
});

let usersOnline = {};

io.on("connection", (socket) => {
  console.log("New connection", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);

    const keys = Object.keys(usersOnline);
    let index;
    keys.map((key) => {
      if (usersOnline[key] == socket.id) {
        index = key;
      }
    });
    delete usersOnline[index];

    io.emit("server:usersOnline", usersOnline);
  });

  socket.on("client:userId", (e) => {
    usersOnline = { ...usersOnline, [e]: socket.id };
    io.emit("server:usersOnline", usersOnline);
  });

  socket.on("client:newMessage", (e) => {
    const { recieverId, userId } = e;
    const socketToSend = recieverId
      .map((item) => usersOnline[item])
      .filter((item) => item);
    const socketToUpdate = usersOnline[userId];

    io.to([socketToSend, socketToUpdate].flat()).emit(
      "server:recieveMssg",
      null
    );
  });

  socket.on("client:messageDeleted", (e) => {
    const { members, userId } = e;

    const socketToSend = members.map((item) => usersOnline[item]);
    const socketToUpdate = usersOnline[userId];

    io.to([socketToSend, socketToUpdate].flat()).emit(
      "server:updateChat",
      null
    );
  });

  socket.on("client:updateChat", (e) => {
    const socketToUpdate = usersOnline[e.id];

    io.to([socketToUpdate]).emit("server:updateChat", null);
  });

  socket.on("client:newFriendRequest", (e) => {
    const { id } = e;
    const socketToSend = usersOnline[id];

    io.to(socketToSend).emit("server:newFriendRequest", null);
  });

  socket.on("client:updateFriendList", (e) => {
    const { userId, friendId } = e;
    const socketsToUpdate = [usersOnline[userId], usersOnline[friendId]];

    io.to(socketsToUpdate).emit("server:updateFriendList", usersOnline);
    io.to(socketsToUpdate).emit("server:recieveMssg", null);
  });

  socket.on("client:hasBeenDeleted", (e) => {
    const { friendId, userId } = e;

    const socketsToUpdate = [usersOnline[friendId], usersOnline[userId]];

    io.to(socketsToUpdate).emit("server:hasBeenDeleted", null);
  });

  socket.on("client:photoChanged", (e) => {
    const { keys, userId } = e;

    const socketsToSend = keys.map((item) => usersOnline[item]);
    const socketToUpdate = usersOnline[userId];

    io.to(socketsToSend).emit("server:photoChanged", userId);
    io.to(socketToUpdate).emit("server:restartToken", null);
  });
});

const port = env.PORT;

server.listen(port, () => console.log("Server running on port: ", port));
