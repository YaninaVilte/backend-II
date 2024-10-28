import CartModel from "../dao/models/cart.model.js";

class CartRepository {
    async createCart() {
        try {
            const newCart = new CartModel({ productos: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async getCartByID(idCart) {
        try {
            const cart = await CartModel.findById(idCart);
            if (!cart) {
                console.log("No existe ese carrito con el id");
                return null;
            }
            return cart;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async addProducts(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartByID(cartId);
            const existeProducto = cart.productos.find(item => item.product._id.toString() === productId);

            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                cart.productos.push({ product: productId, quantity });
            }

            cart.markModified("productos");

            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al agregar productos al carrito:", error);
            throw new Error("Error al agregar productos al carrito");
        }
    }


    async removeProduct(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            cart.productos = cart.productos.filter(item => item.product._id.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async updateProductsCart(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.productos = updatedProducts;

            cart.markModified('productos');
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async updateProductQuantityFromCart(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                
                throw new Error('Carrito no encontrado');
            }
            const productIndex = cart.productos.findIndex(item => item._id.toString() === productId);
        
            if (productIndex !== -1) {
                cart.productos[productIndex].quantity = newQuantity;
                cart.markModified('productos');
                await cart.save();
                return cart;
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }
        } catch (error) {
            throw new Error("Error al actualizar las cantidades");
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { productos: [] },
                { new: true }
            );
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return cart;
        } catch (error) {
            throw new Error("Error");
        }
    }
}

export default CartRepository;