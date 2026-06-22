import express from 'express';
import { register, login, search, addUser, getUsers } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);

// User management routes
router.post('/add-user', addUser);
router.get('/all', protect, getUsers);
router.get('/search', protect, search);

export default router;