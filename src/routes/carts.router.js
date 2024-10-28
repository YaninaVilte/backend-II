import { Router } from 'express';
import CartController from "../controllers/cart.controller.js";
import { soloAdmin, soloUser } from "../middleware/auth.js";
import passport from "passport";

const cartsRouter = Router();
const cartController = new CartController();

cartsRouter.post("/", cartController.newCart);

cartsRouter.get("/:cid", soloUser, cartController.getCartByID);
cartsRouter.post("/:cid/product/:pid", passport.authenticate('current', { session: false }), soloUser, cartController.addProductsToCart);
cartsRouter.delete('/:cid/product/:pid', cartController.removeProductFromCart);
cartsRouter.put('/:cid', cartController.updateProductsCart);
cartsRouter.put('/:cid/product/:pid', cartController.updateProductQuantity);
cartsRouter.delete('/:cid', cartController.clearCart);
cartsRouter.post('/:cid/purchase', passport.authenticate('current', { session: false }), soloUser, cartController.finalizePurchase);


export default cartsRouter;