import userServices from "../services/user.service.js";
import jwt from "jsonwebtoken"; 
import bcrypt from 'bcrypt';
import UserDTO from "../dto/user.dto.js";
import UsersModel from "../dao/models/users.model.js";
import CartModel from "../dao/models/cart.model.js";
import { createHash } from "../utils/util.js";

class UserController {
    async register(req, res) {
        const { first_name, last_name, email, age, password } = req.body; 
        try {
            const existUser = await UsersModel.findOne({ email });
            if (existUser) {
                return res.status(400).send("El usuario ya existe");
            }
            const newCart = new CartModel();
            await newCart.save();
            const newUser = new UsersModel({
                first_name,
                last_name,
                email,
                cart: newCart._id,
                password: createHash(password),
                age
            });
            await newUser.save();
            const token = jwt.sign(
                { _id: newUser._id, user: `${newUser.first_name} ${newUser.last_name}`, email: newUser.email, rol: newUser.rol, cart: newUser.cart },
                "coderhouse",
                { expiresIn: "1h" }
            );
            res.cookie("coderCookieToken", token, {maxAge: 3600000, httpOnly: true});
            res.redirect("/api/users/current"); 
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            res.status(500).send({ error: error.message });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await userServices.loginUser(email, password);
            if (!user || !bcrypt.compareSync(password, user.password)) {
                return res.status(401).send("Credenciales inválidas");
            }
            const token = jwt.sign(
                { _id: user._id, user: `${user.first_name} ${user.last_name}`, email: user.email, rol: user.rol, cart: user.cart },
                "coderhouse",
                { expiresIn: "1h" }
            );
            res.cookie("coderCookieToken", token, { maxAge: 3600000, httpOnly: true });
            res.redirect("/api/users/current");
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            res.status(401).send({ error: "Credenciales inválidas" });
        }
    }
    
    async current(req, res) {
        const userDto = new UserDTO(req.user);
        const isAdmin = req.user.rol === 'admin';
        res.render("home", { user: userDto, isAdmin });
    }

    async logout(req, res) {
        res.clearCookie("coderCookieToken"); 
        res.redirect("/login");
    }

    async admin(req, res) {
        if (req.user.user.rol !== "admin") {
            return res.status(403).send("Acceso denegado");
        }
        res.render("admin");
    }
}


export default UserController; 