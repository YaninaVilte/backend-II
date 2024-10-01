import { promises as fs } from "fs"

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.lastID = 0;
        this.loadCart();
    }

    async loadCart() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) { 
                this.lastID = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.log("Error al cargar el carrito desde el archivo", error);
            await this.saveCart();
        }
    }

    async saveCart() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }


    async createCart() {
        try {
            const newCart = {
                id: ++this.lastID,
                products: []
        }
        this.carts.push(newCart);
        await this.saveCart();
        return newCart;
        } catch (error) {
            console.error("Error al crear un nuevo carrito:", error);
        }
    }


    async getCartByID(cartID) {
        try {
            const cart = this.carts.find(c => c.id === cartID);
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
            const productExist = cart.products.find(p => p.product === productID);
            if (productExist) {
                productExist.quantity += quantity;
            } else {
                cart.products.push({ product: productID, quantity });
            }
            await this.saveCart();
            return cart;
        } catch (error) {
            console.error("Error al agregar productos al carrito:", error);
            throw error;
        }
    }

    async updateCart(cartID, updatedProducts) {

    }
    
    
    

}

export default CartManager; 