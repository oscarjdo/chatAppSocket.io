import { Router } from "express";
import {
  signUp,
  createToken,
  getToken,
  logOut,
  deleteImgFromServer,
  changePhoto,
} from "../controllers/session.controller.js";
import validateForm from "../validators/validateForm.js";
import multerUpload from "../middlewares/multer.js";

const routes = Router();

routes.post("/signUp", validateForm, signUp);

routes.post("/logIn", validateForm, createToken);

routes.get("/logIn", getToken);

routes.delete("/logOut", logOut);

routes.delete("/deleteImgFromServer/:id", deleteImgFromServer);

routes.put("/changePhoto", multerUpload.single("image"), changePhoto);

export default routes;
