import { Router } from "express";
import {
  getFriendList,
  getFriendData,
  getUserList,
} from "../controllers/appData.controller.js";

const routes = Router();

routes.get("/getFriendList/:id", getFriendList);

routes.get("/getUserList/:id", getUserList);

routes.get("/getFriendData/:id", getFriendData);

export default routes;
