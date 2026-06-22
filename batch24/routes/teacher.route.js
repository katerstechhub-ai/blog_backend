import express from 'express';
import { addTeacher, getTeachers } from '../controllers/teacher.controller.js';

const router = express.Router();

router.post('/add', addTeacher);
router.get('/all', getTeachers);

export default router;