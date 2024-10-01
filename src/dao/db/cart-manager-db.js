import CartModel from "../models/cart.model.js";

class CartManager {

    async createCart() {
        try {
            const newCart = new CartModel({productos: []})
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error("Error al crear un nuevo carrito:", error);
        }
    }

    async getCartByID(cartID) {
        try {
            const cart = await CartModel.findById(cartID);
            if (!cart) {
                throw new Error("No existe un carrito con ese ID");
            }
            return cart;
        } catch (error) {
            console.log("Error al obtener el carrito por ID");
            throw error;
        }
    }

    async addProductsToCart(cartID, productID, quantity = 1) {
        try {
            const cart = await this.getCartByID(cartID);
            const productExist = cart.productos.find(p => p.product.toString() === productID);
            if (productExist) {
                productExist.quantity += quantity;
            } else {
                cart.productos.push({ product: productID, quantity });
            }
            cart.markModified("productos");
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al agregar productos al carrito:", error);
            throw error;
        }
    }

    async removeProductFromCart(cartID, productID) {
        try {
            const cart = await this.getCartByID(cartID);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            const productIndex = cart.productos.findIndex(p => p.product._id.toString() === productID);
            if (productIndex === -1) {
                throw new Error("Producto no encontrado en el carrito");
            }
            cart.productos.splice(productIndex, 1);
            await cart.save();
            return { status: 'success', message: 'Producto eliminado exitosamente del carrito', cart };
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            throw error;
        }
    }
    
    async updateProductQuantity(cartID, productID, newQuantity) {
        try {
            const cart = await this.getCartByID(cartID);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            const productIndex = cart.productos.findIndex(p => p.product._id.toString() === productID);
            if (productIndex === -1) {
                throw new Error("Producto no encontrado en el carrito");
            }
            cart.productos[productIndex].quantity = newQuantity;
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito:", error);
            throw error;
        }
    }

    async clearCart(cartID) {
        try {
            const cart = await this.getCartByID(cartID);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            cart.productos = [];
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            throw error;
        }
    }

    async updateProductsToCart(cartID, products) {
        try {
            const cart = await this.getCartByID(cartID);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            for (const { product, quantity } of products) {
                const productID = product._id; 
                const productExist = cart.productos.find(p => p.product.toString() === productID.toString());
                if (productExist) {
                    productExist.quantity += quantity;
                } else {
                    cart.productos.push({ product: productID, quantity });
                }
            }
            cart.markModified("productos");
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al actualizar los productos del carrito:", error);
            throw error;
        }
    }

}

export default CartManager; 