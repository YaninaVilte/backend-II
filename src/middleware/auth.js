export function soloAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).send("Usuario no autenticado");
    }
    if (req.user.rol === "admin") {
        next();
    } else {
        res.status(403).send("Acceso denegado, este lugar es solo para admin queridoooo");
    }
}


export function soloUser(req, res, next) {
    if (!req.user) {
        return res.status(401).send("Usuario no autenticado");
    }
    if (req.user.rol === "user") {
        next();
    } else {
        res.status(403).send("Acceso denegado, este lugar es solo para usuarios comunachos");
    }
}
