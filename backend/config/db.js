import mongoose from "mongoose";
import 'dotenv/config';

export const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Dilki:123456%23@cluster0.wvqgoif.mongodb.net/dairy-farm';
        await mongoose.connect(mongoURI);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
}