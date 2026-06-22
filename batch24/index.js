// import { setDefaultResultOrder } from 'dns';
// setDefaultResultOrder('ipv4first');

// import dotenv from 'dotenv';
// dotenv.config();

// import express from 'express';
// import { connectDB } from './config/db.js';
// import postRoutes from './routes/post.route.js';
// import authRoutes from './routes/auth.route.js';
// import studentRoutes from './routes/student.route.js';
// import teacherRoutes from './routes/teacher.route.js';
// import courseRoutes from './routes/course.route.js';
// import attendanceRoutes from './routes/attendance.route.js';
// import commentRoutes from './routes/comment.route.js';

// const app = express();

// const port = process.env.PORT || 5000;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);

// app.use('/api/post', postRoutes);

// app.use('/api/students', studentRoutes);

// app.use('/api/teachers', teacherRoutes);

// app.use('/api/courses', courseRoutes);

// app.use('/api/attendance', attendanceRoutes);

// app.use('/api/comments', commentRoutes);

// connectDB().then(() => {
//     app.listen(port, () => {
//         console.log(`Server is running on http://localhost:${port}`);
//     });
// });





import { setDefaultResultOrder } from 'dns';
setDefaultResultOrder('ipv4first');

import express from 'express';
import cors from 'cors';
import { connectDB, closeDB } from './config/db.js';
import { env } from './config/env.js';
import postRoutes from './routes/post.route.js';
import authRoutes from './routes/auth.route.js';
import studentRoutes from './routes/student.route.js';
import teacherRoutes from './routes/teacher.route.js';
import courseRoutes from './routes/course.route.js';
import attendanceRoutes from './routes/attendance.route.js';
import commentRoutes from './routes/comment.route.js';

let server;

async function gracefulShutdown(signal) {
    console.log(`\nSignal: ${signal}. Cleaning up...`);
    try {
        if (server) {
            await new Promise((resolve) => server.close(resolve));
            console.log('HTTP server closed');
        }
        await closeDB();
        console.log('Database connection closed');
        process.exit(signal === 'uncaughtException' ? 1 : 0);
    } catch (error) {
        console.error('Error during shutdown:', error.message);
        process.exit(1);
    }
}

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION!', err.name, err.message);
    console.error(err.stack);
    gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION!', err);
    gracefulShutdown('unhandledRejection');
});

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

const app = express();

const port = env.port;

app.use(cors({
    origin: env.crossOrigins.length > 0 ? env.crossOrigins : '*',
    credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/comments', commentRoutes);

(async () => {
    try {
        await connectDB();
        server = app.listen(port, () => {
            console.log(`Blog database running on port ${port} [${env.nodeEnv}]`);
        });
    } catch (error) {
        console.error('Failed to connect:', error.message);
        process.exit(1);
    }
})();

// connectDB().then(() => {
//     app.listen(port, () => {
//         console.log(`Server is running on http://localhost:${port}`);
//     });
// });