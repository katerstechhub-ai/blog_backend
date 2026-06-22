import express from 'express';
import {
    getAllUsers,
    blockUser,
    unblockUser,
    deleteUser,
    adminDeletePost,
    adminDeleteComment,
    getStats
} from '../controllers/admin.controller.js';
import { protect, authorizedAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/users', protect, authorizedAdmin, getAllUsers);
router.put('/users/:id/block', protect, authorizedAdmin, blockUser);
router.put('/users/:id/unblock', protect, authorizedAdmin, unblockUser);
router.delete('/users/:id', protect, authorizedAdmin, deleteUser);
router.delete('/posts/:id', protect, authorizedAdmin, adminDeletePost);
router.delete('/comments/:id', protect, authorizedAdmin, adminDeleteComment);
router.get('/stats', protect, authorizedAdmin, getStats);

export default router;