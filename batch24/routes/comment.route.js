import express from 'express';
import {
    addComment,
    replyToComment,
    getCommentsForPost,
    updateComment,
    deleteComment,
    likeComment
} from '../controllers/comment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/:postId', protect, addComment);
router.post('/reply/:commentId', protect, replyToComment);
router.get('/:postId', getCommentsForPost);
router.put('/:id', protect, updateComment);
router.put('/:id/like', protect, likeComment);
router.delete('/:id', protect, deleteComment);

export default router;