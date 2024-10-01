import { promises as fs } from "fs"

class ProductManager {
    constructor(path) {
        this.products = []
        this.path = path;
        this.loadArray(); 
    }


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

            if (this.products.some(product => product.code === code)) {
                console.log("El código de identificación debe ser único");
                return;
            }

            const lastProductId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
            const newProduct = {
                id: lastProductId + 1,
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails
            };

            this.products.push(newProduct);
            await fs.writeFile(this.path, JSON.stringify(this.products));

            return newProduct;
        } catch (error) {
            console.log("Error al agregar el producto", error);
            throw error;
        }
    }

    getProducts = async () => {
        try {
            const response = await fs.readFile(this.path, "utf-8")
            const responseJSON = JSON.parse(response)
            return responseJSON;
        } catch {
            console.log("Error al leer el archivo", error);
        }
    }


    async getProductById(id) {
        try {
            const arrayProducts = await this.getProducts();
            const productFind = arrayProducts.find(product => product.id === id);

            if (!productFind) {
                console.error("Producto no encontrado");
                return null;
            } else {
                console.log("Producto encontrado");
                return productFind;
            }
        } catch (error) {
            console.error("Error al buscar el producto:", error);
            return null;
        }
    }


    async readFile() {
        const response = await fs.readFile(this.path, "utf-8");
        const arrayProducts = JSON.parse(response);
        return arrayProducts;
    }


    async saveFile(arrayProducts) {
        await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
    }



    async updateProduct(id, updatedProduct) {
        try {
            const arrayProducts = await this.readFile();
            const index = arrayProducts.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProducts[index] = { ...arrayProducts[index], ...updatedProduct };
                await this.saveFile(arrayProducts);
                console.log("Producto actualizado");
            } else {
                console.log("No se encuentra el producto");
            }
        } catch (error) {
            console.log("Tenemos un error al actualizar el producto");
        }
    }

    async deleteProduct(id) {
        try {
            const arrayProducts = await this.readFile();
            const index = arrayProducts.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProducts.splice(index, 1);
                await this.saveFile(arrayProducts);
                console.log("Producto eliminado");
            } else {
                console.log("No se encuentra el producto");
            }
        } catch (error) {
            console.log("Tenemos un error al eliminar productos", error);
        }
    }
}


export default ProductManager;