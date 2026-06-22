import { Student } from '../models/student.model.js';

export const addStudent = async (req, res) => {
    try {
        const { first_name, last_name, email, age, date_of_birth } = req.body;

        if (!first_name || !last_name || !email || !age || !date_of_birth) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        if (age < 5 || age > 30) {
            return res.status(400).json({ message: "Age must be between 5 and 30" });
        }
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: "Student with this email already exists" });
        }

        const student = new Student({ first_name, last_name, email, age, date_of_birth });
        const savedStudent = await student.save();
        res.status(201).json({ message: "Student created successfully", student: savedStudent });
    } catch (error) {
        res.status(500).json({ message: "Error creating student", error: error.message });
    }
};

export const getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        if (students.length === 0) {
            return res.status(404).json({ message: "No students found" });
        }
        res.status(200).json({ message: "Students fetched successfully", count: students.length, students });
    } catch (error) {
        res.status(500).json({ message: "Error fetching students", error: error.message });
    }
};