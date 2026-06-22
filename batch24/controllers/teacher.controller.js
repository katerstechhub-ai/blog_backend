import { Teacher } from '../models/teacher.model.js';

export const addTeacher = async (req, res) => {
    try {
        const { first_name, last_name, email, subject } = req.body;

        if (!first_name || !last_name || !email || !subject) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ message: "Teacher with this email already exists" });
        }

        const teacher = new Teacher({ first_name, last_name, email, subject });
        const savedTeacher = await teacher.save();
        res.status(201).json({ message: "Teacher created successfully", teacher: savedTeacher });
    } catch (error) {
        res.status(500).json({ message: "Error creating teacher", error: error.message });
    }
};

export const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        if (teachers.length === 0) {
            return res.status(404).json({ message: "No teachers found" });
        }
        res.status(200).json({ message: "Teachers fetched successfully", count: teachers.length, teachers });
    } catch (error) {
        res.status(500).json({ message: "Error fetching teachers", error: error.message });
    }
};