import express from 'express';
import { createPost, getAll, deletePost, updatePost, likePost, dislikePost } from '../controllers/post.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/add-post', protect, upload.single("image"), createPost);
router.get('/all', getAll);
router.delete('/:id', protect, deletePost);
router.put('/:id', protect, upload.single("image"), updatePost);
router.put('/:id/like', protect, likePost);
router.put('/:id/dislike', protect, dislikePost);

export default router;