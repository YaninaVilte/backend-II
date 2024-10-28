import TicketModel from "../dao/models/ticket.model.js";
import UsersModel from "../dao/models/users.model.js";
import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import { generateUniqueCode, calcularTotal } from "../utils/cartutils.js";

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();

class CartController {
    async newCart(req, res) {
        try {
            const newCart = await cartRepository.createCart();
            res.json(newCart);
        } catch (error) {
            res.status(500).json({ error: "Error al crear un nuevo carrito." });
        }
    }

    async getCartByID(req, res) {
        const cartID = req.params.cid;
        try {
            const productos = await cartRepository.getCartByID(cartID);
            if (!productos) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
            res.json(productos);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el carrito." });
        }
    }

    async addProductsToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        try {
            await cartRepository.addProducts(cartId, productId, quantity);
            const cartID = (req.user.cart).toString();
            res.redirect(`/carts/${cartID}`);
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error.message);
            res.status(500).json({
                status: 'error',
                message: 'Error al agregar el producto al carrito',
                error: error.message,
            });
        }
    }

    async removeProductFromCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const updatedCart = await cartRepository.removeProduct(cartId, productId);
            res.json({
                status: 'success',
                message: 'Producto eliminado del carrito correctamente',
                updatedCart,
            });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el producto del carrito." });
        }
    }

    async updateProductsCart(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;

        try {
            const updatedCart = await cartRepository.updateProductsCart(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar los productos del carrito." });
        }
    }

    async updateProductQuantity(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        try {
            const updatedCart = await cartRepository.updateProductQuantityFromCart(cartId, productId, newQuantity);
            res.json({
                status: 'success',
                message: 'Cantidad del producto actualizada correctamente',
                updatedCart,
            });
        } catch (error) {
            res.status(500).send("Error al actualizar la cantidad de productos");
        }
    }

    async clearCart(req, res) {
        const cartId = req.params.cid;
        try {
            const updatedCart = await cartRepository.clearCart(cartId);
            res.json({
                status: 'success',
                message: 'Todos los productos del carrito fueron eliminados correctamente',
                updatedCart,
            });
        } catch (error) {
            res.status(500).json({ error: "Error al limpiar el carrito." });
        }
    }

    async finalizePurchase(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartRepository.getCartByID(cartId);
            const productos = cart.productos;

            if (!productos.length) {
                return res.status(400).json({ error: 'El carrito está vacío.' });
            }

            const unpurchasedProducts = [];
            const purchasedProducts = [];

            for (const item of productos) {
                const productId = item.product;
                const product = await productRepository.productById(productId);
                
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save();
                    const subtotal = item.quantity * product.price;
                    purchasedProducts.push({ id: productId, price: item.price, cantidad: item.quantity, subtotal: subtotal });
                } else {
                    unpurchasedProducts.push(productId);
                }
            }

            const userWithCart = await UsersModel.findOne({ cart: cartId });

            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calcularTotal(cart.productos),
                purchaser: userWithCart._id
            });
            await ticket.save();

            cart.productos = cart.productos.filter(item => unpurchasedProducts.some(productId => productId.equals(item.product)));

            await cart.save();

            console.log('Productos comprados:', purchasedProducts);
            console.log('Productos no disponibles:', unpurchasedProducts);

            res.render("checkout", {
                cliente: `${userWithCart.first_name} ${userWithCart.last_name}`,
                email: userWithCart.email,
                numTicket: ticket._id,
                purchasedProducts,
                unpurchasedProducts
            });

        } catch (error) {
            console.error('Error al procesar la compra:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

}

export default CartController; 
