import express from "express";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import passport from "passport";
import http from "http";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/viewsuser.router.js";
import "./database.js";
import usersRouter from "./routes/user.router.js"
import initializePassport from "./config/passport.config.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(passport.initialize());
initializePassport();

app.engine("handlebars", engine({
    extname: ".handlebars",
    defaultLayout: "main",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.use("/", viewsRouter);
app.use("/api/sessions", usersRouter);

const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
    console.log(`Escuchando en http://localhost:${PORT}`);
});