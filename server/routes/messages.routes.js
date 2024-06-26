import { Router } from "express";
import {
  sendMessage,
  addFeaturedMessage,
  removeFeaturedMessage,
  deleteMessagesForAll,
  deleteMessagesForMe,
  getOutOfChat,
  setRecievedMessages,
  setReadMessages,
} from "../controllers/messages.controller.js";

import multerUpload from "../middlewares/multer.js";

const routes = Router();

routes.post("/sendMessage", multerUpload.single("file"), sendMessage);
routes.post("/addFeaturedMessage", addFeaturedMessage);

routes.put("/setRecievedMessages", setRecievedMessages);
routes.put("/setReadMessages", setReadMessages);

routes.delete("/removeFeaturedMessage", removeFeaturedMessage);
routes.delete("/deleteMessagesForAll", deleteMessagesForAll);
routes.delete("/deleteMessagesForMe", deleteMessagesForMe);
routes.delete("/getOutOfChat", getOutOfChat);

export default routes;
