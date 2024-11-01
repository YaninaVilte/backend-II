export function soloAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).send("Usuario no autenticado");
    }
    if (req.user.rol === "admin") {
        next();
    } else {
        res.status(403).send("Este lugar es solo para Admin");
    }
}


export function soloUser(req, res, next) {
    if (!req.user) {
        return res.status(401).send("Usuario no autenticado");
    }
    if (req.user.rol === "user") {
        next();
    } else {
        res.status(403).send("Este lugar es solo para User");
    }
}
