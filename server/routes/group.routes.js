import { Router } from "express";
import { createGroup } from "../controllers/group.controller.js";

import multerUpload from "../middlewares/multer.js";

const routers = Router();

routers.post("/createGroup", multerUpload.single("img"), createGroup);

export default routers;
