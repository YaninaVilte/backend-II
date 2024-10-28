import { Router } from 'express';
import ProductController from "../controllers/product.controller.js";
import { soloAdmin, soloUser } from '../middleware/auth.js';
import passport from "passport";

const productController = new ProductController();

const productsRouter = Router();

productsRouter.get("/", productController.getProducts);
productsRouter.get("/:pid",  productController.getProductById);
productsRouter.post("/", passport.authenticate('current', { session: false }), soloAdmin, productController.addProduct);
productsRouter.put("/:pid", passport.authenticate('current', { session: false }), soloAdmin, productController.updateProduct);
productsRouter.delete("/:pid", passport.authenticate('current', { session: false }), soloAdmin, productController.deleteProduct);


export default productsRouter;