import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import { env } from "../config/env.js";

dotenv.config();

// const generateToken = (id, role) => {
//     return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
// }

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, env.jwtAccessSecret , { expiresIn: "7d" });
}

// REGISTER
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed
        });

        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "Account has been blocked" });
        }

        // Update lastSeen and isOnline on login
        user.lastSeen = Date.now();
        user.isOnline = true;
        await user.save();

        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                lastSeen: user.lastSeen,
                isOnline: user.isOnline
            },
            token
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// SEARCH
export const search = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        }).select("-password");

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// LOGOUT (optional - to update lastSeen and isOnline)
export const logout = async (req, res) => {
    try {
        const userId = req.user._id;
        
        await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: Date.now()
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}