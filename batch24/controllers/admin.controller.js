import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found" });
        }

        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const blockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role === "admin") {
            return res.status(403).json({ success: false, message: "Cannot block an admin" });
        }

        user.isBlocked = true;
        await user.save();

        res.status(200).json({ success: true, message: "User blocked successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const unblockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.isBlocked = false;
        await user.save();

        res.status(200).json({ success: true, message: "User unblocked successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role === "admin") {
            return res.status(403).json({ success: false, message: "Cannot delete an admin" });
        }

        await user.deleteOne();
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const adminDeletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        await post.deleteOne();
        res.status(200).json({ success: true, message: "Post deleted by admin" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const adminDeleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        await comment.deleteOne();
        res.status(200).json({ success: true, message: "Comment deleted by admin" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const postCount = await Post.countDocuments();
        const commentCount = await Comment.countDocuments();
        const blockedCount = await User.countDocuments({ isBlocked: true });

        res.status(200).json({
            success: true,
            data: {
                totalUsers: userCount,
                totalPosts: postCount,
                totalComments: commentCount,
                blockedUsers: blockedCount
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};