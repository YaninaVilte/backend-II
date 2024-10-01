import { Router } from "express";
const router = Router(); 
import UsersModel from "../dao/models/users.model.js";
import jwt from "jsonwebtoken"; 
import passport from "passport";
import { createHash, isValidPassword } from "../utils/util.js";
import CartModel from "../dao/models/cart.model.js";

router.post("/register", async (req, res) => {
    let { first_name, last_name, email, password, age } = req.body; 
    try {
        const userExist = await UsersModel.findOne({ email }); 
        if (userExist) {
            return res.status(400).send("El user ya existe");
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
        const token = jwt.sign({ user: newUser }, "coderhouse", {expiresIn: "1h"}); 
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, 
            httpOnly: true
        })
        res.redirect("/api/sessions/current"); 
    } catch (error) {
        res.status(500).send("Error interno del servidor"); 
    }
})

router.post("/login", async (req, res) => {
    let { email, password} = req.body; 
    try {
        const userFound = await UsersModel.findOne({ email }); 
        if (!userFound) {
            return res.status(401).send("Usuario no identificado"); 
        }
        if (!isValidPassword(password, userFound)) {
            return res.status(401).send("La contraseña ingresada es incorrecta"); 
        }
        const token = jwt.sign({
            user: userFound
        }, "coderhouse", {expiresIn: "1h"}); 
         res.cookie("coderCookieToken", token, {
             maxAge: 3600000, 
             httpOnly: true
         })
         res.redirect("/api/sessions/current"); 
    } catch (error) {
        res.status(500).send("Error interno del servidor"); 
    }
})

router.get("/current", passport.authenticate("current", { session: false }), (req, res) => {
    res.render("home", { user: req.user.user });
});


router.post("/logout", (req, res) => {
    res.clearCookie("coderCookieToken"); 
    res.redirect("/login"); 
})

router.get("/admin", passport.authenticate("current", {session: false}), (req, res) => {
    if(req.user.rol !== "admin") {
        return res.status(403).send("Acceso denegado, usted no tiene los permisos de administrador"); 
    }
    res.render("admin");
})

export default router;