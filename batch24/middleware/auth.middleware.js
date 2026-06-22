import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { env } from "../config/env.js"


export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
        return res.status(401).json({
            message: "Not authorized, no token provided"
        })
    }
// process.env.JWT_SECRET   jwt.verify
    try {
        const decoded = jwt.verify(token, env.jwtAccessSecret)
        const user = await User.findById(decoded.id).select("-password")

        if (!user) {
            return res.status(401).json({
                message: "User no longer exists"
            })
        }
        if(user.isBlocked){
            return res.status(403).json({
                message: "Account has been blocked by admin"
            })
        }

        req.user = user;
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Not authorized"
        })
    }
}

export const authorizedAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Not authorized, please login"
        })
    }
    
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admin only."
        })
    }
    
    next()
}