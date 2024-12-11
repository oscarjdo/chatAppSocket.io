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

  const socketsToSend = (users) =>
    users.map((item) => usersOnline[item]).filter((item) => item);

  socket.on("client:reloadApp", (e) => {
    io.to(socketsToSend(e.users)).emit("server:reloadApp", {});
  });

  socket.on("client:reloadChat", (e) =>
    io.to(socketsToSend(e.users)).emit("server:reloadChat", null)
  );

  socket.on("client:reloadFriendRequests", (e) => {
    const { user } = e;

    const socketToSend = usersOnline[user];

    io.to(socketToSend).emit("server:reloadFriendRequests", null);
  });

  socket.on("client:photoChanged", (e) => {
    const { keys, userId } = e;

    const userSocket = usersOnline[userId];

    io.to(socketsToSend(keys)).emit("server:reloadApp", null);
    io.to(userSocket).emit("server:restartToken", null);
  });
});

const port = env.PORT;

server.listen(port, () => console.log("Server running on port: ", port));
