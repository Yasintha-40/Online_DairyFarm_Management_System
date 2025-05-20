import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true
    },
    task: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: "Pending"
    }
}, { timestamps: true });

const taskModel = mongoose.model("Task", taskSchema);

export default taskModel;
