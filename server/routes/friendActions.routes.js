import { Router } from "express";
import {
  sendFriendRequest,
  cancelFriendRequest,
  getFriendRequest,
  acceptFriendRequest,
  deleteOfFriendList,
} from "../controllers/friendActions.controller.js";

const routes = Router();

routes.post("/sendFriendRequest", sendFriendRequest);

routes.delete("/cancelFriendRequest", cancelFriendRequest);

routes.get("/getFriendRequest/:id", getFriendRequest);

routes.post("/acceptFriendRequest", acceptFriendRequest);

routes.delete("/deleteOfFriendList", deleteOfFriendList);

export default routes;
