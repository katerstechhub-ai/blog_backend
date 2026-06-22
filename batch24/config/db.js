import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import { env } from './env.js'

dotenv.config();

dns.setServers(['8.8.8.8', '8.8.4.4']);

// export const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI, {
//             dbName: 'studenthub'
//         });
//         console.log("Connected to the database successfully");
//     } catch (error) {
//         console.error(error);
//     }
// };


export async function connectDB() {
    mongoose.set('strictQuery', true);

    mongoose.connection.on('connected', () => console.log(`connected to blog database`));
    mongoose.connection.on('error', (err) => console.error(`MongoDB error: `, err.message
    ));
    mongoose.connection.on('disconnected', () => console.warn('Disconnected from database. Attempting to reconnect...'));

    const options = {
        dbName: 'studenthub',
        autoIndex: !env.isProd,
        maxPoolSize: 50,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000
    };
    try {
        await mongoose.connect(env.mongoUrl, options);
    } catch (err) {
        console.error('Initial MongoDB connection failed:', err.message);
        process.exit(1);
    }
}

export async function closeDB() {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (err) {
        console.error('Error closing MongoDB connection:', err.message);
    }
}