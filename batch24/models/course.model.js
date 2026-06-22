import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    course_name: { type: String, required: true },
    course_code: { type: String, required: true, unique: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
export { Course };