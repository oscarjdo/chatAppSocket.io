import { Router } from "express";
import {
  createGroup,
  leaveGroup,
  updateGroupData,
  changeGroupPhoto,
} from "../controllers/group.controller.js";

import multerUpload from "../middlewares/multer.js";

const routers = Router();

routers.post("/createGroup", multerUpload.single("img"), createGroup);

routers.delete("/leaveGroup", leaveGroup);

routers.put("/updateGroupData", updateGroupData);

routers.put(
  "/changeGroupPhoto",
  multerUpload.single("image"),
  changeGroupPhoto
);

export default routers;
