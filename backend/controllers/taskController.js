import taskModel from "../models/taskModel.js";

// Add a new task
const addTask = async (req, res) => {
    try {
        console.log("Adding new task:", req.body);
        const task = new taskModel(req.body);
        await task.save();
        console.log("Task saved successfully:", task);
        res.json({ success: true, message: "Task added successfully", data: task });
    } catch (error) {
        console.error("Add task error:", error);
        res.status(500).json({ success: false, message: "Failed to add task" });
    }
};

// Get all tasks
const getTasks = async (req, res) => {
    try {
        console.log("Fetching all tasks");
        const tasks = await taskModel.find();
        console.log("Found tasks:", tasks);
        res.json({ success: true, data: tasks });
    } catch (error) {
        console.error("Get tasks error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch tasks" });
    }
};

// Get tasks by Employee ID
const getTasksByEmployeeId = async (req, res) => {
    try {
        console.log("Searching for tasks with employeeId:", req.params.employeeId);
        const tasks = await taskModel.find({ employeeId: req.params.employeeId });
        console.log("Found tasks:", tasks);
        res.json({ success: true, data: tasks });
    } catch (error) {
        console.error("Get tasks by employeeId error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch tasks" });
    }
};

// Get task by ID
const getTaskById = async (req, res) => {
    try {
        console.log("Searching for task with ID:", req.params.id);
        const task = await taskModel.findById(req.params.id);
        console.log("Found task:", task);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        res.json({ success: true, data: task });
    } catch (error) {
        console.error("Get task error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch task" });
    }
};

// Update task
const updateTask = async (req, res) => {
    try {
        console.log("Updating task:", req.params.id, "with data:", req.body);
        const task = await taskModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log("Updated task:", task);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        res.json({ success: true, message: "Task updated successfully", data: task });
    } catch (error) {
        console.error("Update task error:", error);
        res.status(500).json({ success: false, message: "Failed to update task" });
    }
};

// Delete task
const deleteTask = async (req, res) => {
    try {
        console.log("Deleting task:", req.params.id);
        const task = await taskModel.findByIdAndDelete(req.params.id);
        console.log("Deleted task:", task);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        res.json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        console.error("Delete task error:", error);
        res.status(500).json({ success: false, message: "Failed to delete task" });
    }
};

export { 
    addTask, 
    getTasks, 
    getTasksByEmployeeId, 
    getTaskById, 
    updateTask, 
    deleteTask 
};
