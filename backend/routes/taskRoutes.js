import express from "express";
import { addTask, getTasks, getTasksByEmployeeId, getTaskById, updateTask, deleteTask } from "../controllers/taskController.js";

const router = express.Router();

router.post("/add", addTask);
router.get("/list", getTasks);
router.get("/employee/:employeeId", getTasksByEmployeeId);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
