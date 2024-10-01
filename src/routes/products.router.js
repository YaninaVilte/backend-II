import { Router } from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import ProductsModel from "../dao/models/products.model.js";

const manager = new ProductManager();
const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
    const { page = 1, limit = 10, sort = 'desc', query = '' } = req.query;
    const sortOrder = sort === 'asc' ? 1 : -1;
    
    const filter = query ? {
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } },
            { code: { $regex: query, $options: 'i' } },
            { status: query === 'true' ? true : query === 'false' ? false : undefined },
            { stock: parseInt(query) },
            { price: parseInt(query) }

        ]
    } : {};

    try {
        const productsList = await ProductsModel.paginate(filter, {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { price: sortOrder }
        });

        const prevLink = productsList.hasPrevPage ? 
            `/products?page=${productsList.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null;
        const nextLink = productsList.hasNextPage ? 
            `/products?page=${productsList.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null;

        res.json({
            status: 'success',
            payload: 
            {docs: [productsList.docs]},
            totalPages: productsList.totalPages,
            prevPage: productsList.prevPage,
            nextPage: productsList.nextPage,
            page: productsList.page,
            hasPrevPage: productsList.hasPrevPage,
            hasNextPage: productsList.hasNextPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ status: 'error', message: 'Error' });
    }
});

productsRouter.get("/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const product = await manager.getProductById(id);
        if (!product) {
            res.status(404).send("Producto no encontrado");
        } else {
            res.send(product);
        }
    } catch (error) {
        res.status(500).send("Error el id en los productos");
    }
});

productsRouter.post("/", async (req, res) => {
    const newProduct = req.body;
    try {
        await manager.addProduct(newProduct);
        res.status(201).send("Producto agregado");
    } catch (error) {
        res.status(500).send("Error del servidor")
    }
})

productsRouter.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const { title, description, price, code, stock, status = true, category } = req.body;
    try {
        await manager.updateProduct(String(pid), { title, description, price, code, stock, status, category });
        res.json({ message: "Producto actualizado exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al intentar editar producto");
    }
});

productsRouter.delete("/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        await manager.deleteProduct(String(pid));
        res.send("Producto eliminado exitosamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al eliminar producto");
    }
});

export default productsRouter;