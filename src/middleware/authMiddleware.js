import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

// Read the token from the request and check if it's valid
export const authMiddleware = async (req, res, next) => {
    console.log("Auth middleware reached");

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return res.status(401).json({ error: "Not authorized - no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        req.user = user; // Attach user to request object
        next();
    } catch (err) {
        console.error("Auth middleware error: ", err);
        return res.status(401).json({ error: "Not authorized" });
    }
};