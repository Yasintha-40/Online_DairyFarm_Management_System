const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        unique: true,
        required: true,
        match: /^[a-zA-Z0-9]{10}$/ // 10 characters, letters (upper/lower) and numbers
    },
    name: {
        type: String,
        required: true,
        match: /^[a-zA-Z\s]+$/ // Only upper/lowercase letters and spaces
    },
    nic: {
        type: String,
        required: true,
        match: /^(?:\d{10}|\d{9}[vV])$/ // Either 10 digits or 11 digits followed by 'V' or 'v'
    },
    mobile: {
        type: String,
        required: true,
        match: /^\d{10}$/ // Exactly 10 digits
    },
    address: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9\s,.-]+$/ // Allows numbers, letters (upper/lower), spaces, commas, dots, and hyphens
    },
    department: {
        type: String,
        required: true,
        enum: ['Farm', 'Factory', 'Outsiders', 'Delivery', 'Vetinary', 'Lab', 'other primary providers', 'Support services']
    },
    position: {
        type: String,
        required: true,
        match: /^[a-zA-Z\s]+$/ // Only upper/lowercase letters and spaces
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    birthdate: {
        type: Date,
        required: true
    }
});

module.exports = Employee = mongoose.model("employee",EmployeeSchema);
