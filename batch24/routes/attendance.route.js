import express from 'express';
import { markAttendance, getAttendance } from '../controllers/attendance.controller.js';

const router = express.Router();

router.post('/mark', markAttendance);
router.get('/all', getAttendance);

export default router;