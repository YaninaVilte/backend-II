import ProductRepository from "../repositories/product.repository.js";

const productRepository = new ProductRepository();

class ProductController {
    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            const resultado = await productRepository.addProductToStore(newProduct);
            res.json(resultado);

        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async getProducts(req, res) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;

            const productos = await productRepository.getProductsFromStore(limit, page, sort, query);
           
            res.json(productos);
        } catch (error) { 
            res.status(500).send("Error");
        }
    }

    async getProductById(req, res) {
        const id = req.params.pid;
        try {
            const buscado = await productRepository.productById(id);
            if (!buscado) {
                return res.json({
                    error: "Producto no encontrado"
                });
            }
            res.json(buscado);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async updateProduct(req, res) {
        try {
            const id = req.params.pid;
            const updatedProduct = req.body;

            const resultado = await productRepository.updateProductFromStore(id, updatedProduct);
            res.json(resultado);
        } catch (error) {
            res.status(500).send("Error al actualizar el producto");
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.pid;
        try {
            let respuesta = await productRepository.deleteProductFromStore(id);
            res.json(respuesta);
        } catch (error) {
            res.status(500).send("Error al eliminar el producto");
        }
    }
}

export default ProductController;