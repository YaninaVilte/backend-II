import { Router } from "express";
import CartManager from "../dao/db/cart-manager-db.js";

const cartManager = new CartManager();
const cartsRouter = Router();

cartsRouter.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
})

cartsRouter.get("/:cid", async (req, res) => {
    let cartID = req.params.cid;

    try {
        const cart = await cartManager.getCartByID(cartID);
        res.json(cart.productos);
    } catch (error) {
        res.status(500).send("Error al obtener los productos del carrito");
    }
})

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    let cartID = req.params.cid;
    let productID = req.params.pid;
    let quantity = req.body.quantity || 1;

    try {
        const updatedCart = await cartManager.addProductsToCart(cartID, productID, quantity);
        res.json(updatedCart.productos);
    } catch (error) {
        res.status(500).send("Error al agregar un producto al carrito");
    }
})

cartsRouter.delete("/:cid/product/:pid", async (req, res) => {
    const { pid, cid } = req.params;
    try {
        const result = await cartManager.removeProductFromCart(cid, pid);
        if (result.status === 'success') {
            res.status(200).send(result.message);
        } else {
            res.status(404).send(result.message);
        }
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        res.status(500).send("Error");
    }
});

cartsRouter.put("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.json(updatedCart.productos);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al actualizar la cantidad del producto");
    }
});

cartsRouter.delete("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const clearedCart = await cartManager.clearCart(cid);
        res.json({ message: "Carrito vaciado exitosamente", cart: clearedCart });
    } catch (error) {
        console.error("Error al vaciar el carrito:", error);
        res.status(500).send("Error al vaciar el carrito");
    }
});

cartsRouter.put("/:cid", async (req, res) => {
    const cartID = req.params.cid;
    const products = req.body;
    try {
        if (!Array.isArray(products)) {
            return res.status(400).send("El cuerpo de la solicitud debe ser un array de productos");
        }
        const updatedCart = await cartManager.updateProductsToCart(cartID, products);
        res.status(200).json({
            message: 'Productos actualizados exitosamente'
        });
    } catch (error) {
        console.error("Error al actualizar los productos del carrito:", error);
        res.status(500).send("Error al actualizar los productos del carrito");
    }
});

export default cartsRouter;