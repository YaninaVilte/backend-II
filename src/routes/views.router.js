import { Router } from 'express';
import { soloAdmin, soloUser } from '../middleware/auth.js';
import ViewsController from "../controllers/view.controller.js";
import passport from "passport";

const viewsRouter = Router();
const viewsController = new ViewsController();

viewsRouter.get("/products", passport.authenticate('current', { session: false }), soloUser, viewsController.renderProducts);
viewsRouter.get("/carts/:cid", passport.authenticate('current', { session: false }), soloUser, viewsController.renderCart);
viewsRouter.get("/login", viewsController.renderLogin);
viewsRouter.get("/register", viewsController.renderRegister);
viewsRouter.get("/realtimeproducts", passport.authenticate('current', { session: false }), soloAdmin, viewsController.renderRealTimeProducts);
viewsRouter.get("/", viewsController.renderHome);

export default viewsRouter;