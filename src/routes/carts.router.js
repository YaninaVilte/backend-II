import { Router } from 'express';
import CartController from "../controllers/cart.controller.js";
import { soloUser } from "../middleware/auth.js";
import passport from "passport";

const cartsRouter = Router();
const cartController = new CartController();

cartsRouter.post("/", cartController.newCart);

cartsRouter.get("/:cid", soloUser, cartController.getCartByID);
cartsRouter.post("/:cid/product/:pid", passport.authenticate('current', { session: false }), soloUser, cartController.addProductsToCart);

cartsRouter.delete('/:cid/product/:pid', passport.authenticate('current', { session: false }), soloUser, cartController.removeProductFromCart);

cartsRouter.put('/:cid', passport.authenticate('current', { session: false }), soloUser, cartController.updateProductsCart);
cartsRouter.put('/:cid/product/:pid', passport.authenticate('current', { session: false }), soloUser, cartController.updateProductQuantity);
cartsRouter.delete('/:cid', passport.authenticate('current', { session: false }), soloUser, cartController.clearCart);
cartsRouter.post('/:cid/purchase', passport.authenticate('current', { session: false }), soloUser, cartController.finalizePurchase);


export default cartsRouter;