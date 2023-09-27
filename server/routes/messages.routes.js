import { Router } from "express";
import {
  sendMessage,
  getOutOfChat,
} from "../controllers/messages.controller.js";

import multerUpload from "../middlewares/multer.js";

const routes = Router();

routes.post("/sendMessage", multerUpload.single("file"), sendMessage);

routes.delete("/getOutOfChat", getOutOfChat);

export default routes;
