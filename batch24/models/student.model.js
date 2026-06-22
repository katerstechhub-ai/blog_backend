import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true, min: 5, max: 30 },
    date_of_birth: { type: Date, required: true },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export { Student };