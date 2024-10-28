import { Server } from "socket.io";
import ProductRepository from "../repositories/product.repository.js";

class SocketManager {
    constructor(httpServer) {
        this.io = new Server(httpServer);
        this.productRepository = new ProductRepository();

        this.io.on("connection", async (socket) => {
            console.log("Nuevo cliente conectado");

            const productos = await this.productRepository.getProductsFromStore();
            socket.emit("productos", productos);

            socket.on("fetchProducts", async ({ page, limit }) => {
                const productosPaginados = await this.productRepository.getProductsFromStore(limit, page);
                socket.emit("productos", productosPaginados);
            });

            socket.on("addProductToStore", async (producto) => {
                await this.productRepository.addProductToStore(producto);
                this.emitUpdatedProducts();
            });

            socket.on("deleteProductFromStore", async (id) => {
                await this.productRepository.deleteProductFromStore(id);
                this.emitUpdatedProducts();
            });
        });
    }

    async emitUpdatedProducts() {
        const productosActualizados = await this.productRepository.obtenerProductos();
        this.io.emit("productos", productosActualizados);
    }
}

export default SocketManager;