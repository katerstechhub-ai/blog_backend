import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
}, { timestamps: true });

const Teacher = mongoose.model('Teacher', teacherSchema);
export { Teacher };