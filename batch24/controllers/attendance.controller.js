import { Attendance } from '../models/attendance.model.js';

export const markAttendance = async (req, res) => {
    try {
        const { student, course, date, status } = req.body;

        if (!student || !course || !date || !status) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        if (!['present', 'absent', 'late'].includes(status)) {
            return res.status(400).json({ message: "Status must be present, absent or late" });
        }

        const attendance = new Attendance({ student, course, date, status });
        const savedAttendance = await attendance.save();
        res.status(201).json({ message: "Attendance marked successfully", attendance: savedAttendance });
    } catch (error) {
        res.status(500).json({ message: "Error marking attendance", error: error.message });
    }
};

export const getAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find()
            .populate('student', 'first_name last_name email')
            .populate('course', 'course_name course_code');
        if (attendance.length === 0) {
            return res.status(404).json({ message: "No attendance records found" });
        }
        res.status(200).json({ message: "Attendance fetched successfully", count: attendance.length, attendance });
    } catch (error) {
        res.status(500).json({ message: "Error fetching attendance", error: error.message });
    }
};