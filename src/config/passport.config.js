import passport from "passport";
import jwt from "passport-jwt";
import UsersModel from "../dao/models/users.model.js";

const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initializePassport = () => {
    passport.use("current", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "coderhouse",
    }, async (jwt_payload, done) => {
        try {
            console.log('JWT Payload:', jwt_payload);
            const user = await UsersModel.findById(jwt_payload._id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
}

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];
    }
    return token;
}

export default initializePassport;