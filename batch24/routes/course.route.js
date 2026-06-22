import express from 'express';
import { addCourse, getCourses } from '../controllers/course.controller.js';

const router = express.Router();

router.post('/add', addCourse);
router.get('/all', getCourses);

export default router;