import ProductsModel from "../models/products.model.js";

class ProductManager {

    async loadArray() {
        try {
            this.products = await this.readFile();
        } catch (error) {
            console.log("Error al inicializar ProductManager", error);
        }
    }

    addProduct = async ({ title, description, code, price, status = true, stock, category, thumbnails }) => {
        try {
            this.products = await this.getProducts();

            if (!title || !description || !code || !price || !stock || !category) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            const productExist = await ProductsModel.findOne({ code: code });
            if (productExist) {
                console.log("El código debe ser unico");
                return;
            }

            const newProduct = new ProductsModel({
                title,
                description,
                code,
                price,
                status: true,
                stock,
                category,
                thumbnails: thumbnails || []
            });

            await newProduct.save();
        } catch (error) {
            console.log("Error al agregar el producto", error);
            throw error;
        }
    }

    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const products = await ProductsModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductsModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: products,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.log("Error al obtener los productos", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const productFind = await ProductsModel.findById(id);
            if (!productFind) {
                console.error("Producto no encontrado");
                return null;
            }
            return productFind;
        } catch (error) {
            console.error("Error al buscar el producto:", error);
            return null;
        }
    }


    async updateProduct(id, updatedProduct) {
        try {
            const productUpdate = await ProductsModel.findByIdAndUpdate(id, updatedProduct);
            if (!productUpdate) {
                console.log("No se encuentra el producto");
                return null;
            }
            return productUpdate;
        } catch (error) {
            console.log("Error al actualizar el producto");
        }
    }

    async deleteProduct(id) {
        try {
            const productDelete = await ProductsModel.findByIdAndDelete(id);
            if (!productDelete) {
                console.log("No se encuentra el producto");
                return null;
            }
            console.log("Producto eliminado exitosamente");
            return productDelete; // Devuelve el producto eliminado
        } catch (error) {
            console.log("Error al eliminar producto", error);
            return { error: "Error al eliminar producto" }; // Devuelve un mensaje de error
        }
    }
}

export default ProductManager;