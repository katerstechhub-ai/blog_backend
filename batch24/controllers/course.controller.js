import { Course } from '../models/course.model.js';

export const addCourse = async (req, res) => {
    try {
        const { course_name, course_code, teacher } = req.body;

        if (!course_name || !course_code || !teacher) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const existingCourse = await Course.findOne({ course_code });
        if (existingCourse) {
            return res.status(400).json({ message: "Course with this code already exists" });
        }

        const course = new Course({ course_name, course_code, teacher });
        const savedCourse = await course.save();
        res.status(201).json({ message: "Course created successfully", course: savedCourse });
    } catch (error) {
        res.status(500).json({ message: "Error creating course", error: error.message });
    }
};

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('teacher', 'first_name last_name subject');
        if (courses.length === 0) {
            return res.status(404).json({ message: "No courses found" });
        }
        res.status(200).json({ message: "Courses fetched successfully", count: courses.length, courses });
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses", error: error.message });
    }
};