import { Router } from "express";
import {
  sendMessage,
  deleteMessagesForAll,
  deleteMessagesForMe,
  getOutOfChat,
} from "../controllers/messages.controller.js";

import multerUpload from "../middlewares/multer.js";

const routes = Router();

routes.post("/sendMessage", multerUpload.single("file"), sendMessage);

routes.delete("/deleteMessagesForAll", deleteMessagesForAll);
routes.delete("/deleteMessagesForMe", deleteMessagesForMe);

routes.delete("/getOutOfChat", getOutOfChat);

export default routes;
