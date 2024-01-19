import { Router } from "express";
import sessionRoutes from "./session.routes.js";
import appDataRoutes from "./appData.routes.js";
import friendActionsRoutes from "./friendActions.routes.js";
import messagesRoutes from "./messages.routes.js";
import groupRoutes from "./group.routes.js";

const routes = Router();

routes.use(sessionRoutes);
routes.use(appDataRoutes);
routes.use(friendActionsRoutes);
routes.use(messagesRoutes);
routes.use(groupRoutes);

export default routes;
