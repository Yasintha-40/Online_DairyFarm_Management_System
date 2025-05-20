import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoutes.js';
import 'dotenv/config';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoute.js';
import router1 from './routes/cowRoutes.js';
import router2 from './routes/vaccineRoutes.js';
import taskRouter from './routes/taskRoutes.js';
import employeeRouter from './routes/employeeRoutes.js';
import animalRouter from './routes/animalRoutes.js';
import serviceRouter from './routes/serviceRoutes.js';
import animalServiceRouter from './routes/animalServiceRoutes.js';
import authRouter from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();
const port = 4000;

// CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes for cows and vaccines
app.use("/cows", router1);
app.use("/vaccines", router2);

// DB connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/task", taskRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/animals", animalRouter);
app.use("/api/services", serviceRouter);
app.use("/api/animal-services", animalServiceRouter);
app.use("/api/auth", authRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.get("/", (req, res) => {
    res.send("API Working");
});

// Server listen
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
