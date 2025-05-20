const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    department: {
        type: String,
        required: true,
        enum: ['Farm', 'Factory', 'Outsiders', 'Delivery', 'Vetinary','Lab','other primary providers','Support services'] // Example dropdown values
    },
    task: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9\s,.-]+$/ // Allows numbers, letters (upper/lower), spaces, commas, dots, and hyphens
    },
    description: {
        type: String,
        match: /^[a-zA-Z0-9\s,.-]+$/ // Allows numbers, letters (upper/lower), spaces, commas, dots, and hyphens
    },
    employeeId: {
        type: String,
        unique: true,
        required: true,
        match: /^[a-zA-Z0-9]{10}$/ // 10 characters, letters (upper/lower) and numbers
    },
    
});

module.exports = Task = mongoose.model("task",TaskSchema);