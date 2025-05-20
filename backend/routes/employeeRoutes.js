import express from "express";
import { addEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee, loginEmployee, getEmployeeByEmail } from "../controllers/employeeController.js";
import { authMiddleware } from "../middleware/auth.js";

const employeeRouter = express.Router();

// Public routes
employeeRouter.post("/login", loginEmployee);

// Protected routes - require authentication
employeeRouter.get("/list", authMiddleware, getEmployees);
employeeRouter.get("/email/:email", authMiddleware, getEmployeeByEmail);
employeeRouter.put("/email/:email", authMiddleware, updateEmployee);
employeeRouter.post("/add", authMiddleware, addEmployee);
employeeRouter.get("/id/:id", authMiddleware, getEmployeeById);
employeeRouter.put("/id/:id", authMiddleware, updateEmployee);
employeeRouter.delete("/id/:id", authMiddleware, deleteEmployee);

export default employeeRouter; 