import ProductsModel from "../dao/models/products.model.js";
import CartRepository from "../repositories/cart.repository.js";
import { calcularTotal } from "../utils/cartutils.js";

const cartRepository = new CartRepository();

class ViewsController {
    async renderProducts(req, res) {
        try {
            const { page = 1, limit = 3 } = req.query;
            const skip = (page - 1) * limit;
            const productos = await ProductsModel
                .find()
                .skip(skip)
                .limit(limit);
            const totalProducts = await ProductsModel.countDocuments();
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
            const newArray = productos.map(producto => {
                const { _id, ...rest } = producto.toObject();
                return { id: _id, ...rest };
            });
            const cartId = req.user.cart.toString();
            res.render("products", {
                productos: newArray,
                hasPrevPage,
                hasNextPage,
                prevPage: page > 1 ? parseInt(page) - 1 : null,
                nextPage: page < totalPages ? parseInt(page) + 1 : null,
                currentPage: parseInt(page),
                totalPages,
                cartId
            });

        } catch (error) {
            console.error("Error al obtener productos", error);
            res.status(500).json({
                status: 'error',
                error: "Error interno del servidor"
            });
        }
    }

    async renderCart(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartRepository.getCartByID(cartId);

            if (!cart) {
                console.log(`Carrito con ID ${cartId} no encontrado.`);
                return res.status(404).json({ error: "Carrito no encontrado" });
            }

            const productsInCart = cart.productos.map(item => {
                const product = item.product;
                const quantity = item.quantity;
                const price = product.price;
                const totalPrice = product.price * quantity;
                const title = product.title;

                return {
                    product: { ...product, price, totalPrice },
                    quantity,
                    productId: product._id,
                    cartId,
                    title
                };
            });

            const totalPurchase = calcularTotal(cart.productos);

            res.render("carts", { productos: productsInCart, totalPurchase, cartId });
        } catch (error) {
            console.error("Error al obtener el carrito", error);
            res.status(500).json({ error: "Error interno del servidor", details: error.message });
        }
    }



    async renderLogin(req, res) {
        res.render("login");
    }

    async renderRegister(req, res) {
        res.render("register");
    }

    async renderRealTimeProducts(req, res) {
        const usuario = req.user;
        try {
            res.render("realtimeproducts", { rol: usuario.rol, email: usuario.email });
        } catch (error) {
            console.log("error en la vista real time", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async renderChat(req, res) {
        res.render("chat");
    }

    async renderHome(req, res) {
        res.render("home");
    }
}

export default ViewsController;