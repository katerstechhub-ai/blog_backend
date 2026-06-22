import { v2 as cloudinary } from 'cloudinary';
import { Post } from "../models/post.model.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

export const createPost = async (req, res) => {
  try {
    const { title, content, image } = req.body;

    let imageData = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageData = {
        url: result.secure_url,
        public_id: result.public_id
      };
    } else if (image) {
      imageData = { url: image, public_id: null };
    }

    const post = await Post.create({
      title,
      content,
      image: imageData,
      author: req.user._id
    });

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const getAll = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

        if (posts.length === 0) {
            return res.status(404).json({ success: false, message: "No posts found" });
        }

        res.status(200).json({ success: true, count: posts.length, data: posts });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this post" });
        }

        await post.deleteOne();
        res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { title, content, image } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to update this post" });
        }

        if (title) post.title = title;
        if (content) post.content = content;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            post.image = { url: result.secure_url, public_id: result.public_id };
        } else if (image) {
            post.image = { url: image, public_id: null };
        }

        const updatedPost = await post.save();
        res.status(200).json({ success: true, data: updatedPost });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const userId = req.user._id.toString();

        if (post.likes.some(id => id.toString() === userId)) {
            return res.status(400).json({ success: false, message: "You already liked this post" });
        }

        post.dislikes = post.dislikes.filter(id => id.toString() !== userId.toString());
        post.likes.push(req.user._id);

        const updatedPost = await post.save();
        res.status(200).json({ success: true, message: "Post liked", data: updatedPost });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const dislikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const userId = req.user._id.toString();

        if (post.dislikes.some(id => id.toString() === userId)) {
            return res.status(400).json({ success: false, message: "You already disliked this post" });
        }

        post.likes = post.likes.filter(id => id.toString() !== userId);
        post.dislikes.push(req.user._id);

        const updatedPost = await post.save();
        res.status(200).json({ success: true, message: "Post disliked", data: updatedPost });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};