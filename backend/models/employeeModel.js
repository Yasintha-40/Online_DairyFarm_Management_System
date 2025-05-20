import mongoose from "mongoose";
import bcrypt from "bcrypt";

const EmployeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        unique: true,
        required: true,
        match: /^[a-zA-Z0-9]{10}$/
    },
    name: {
        type: String,
        required: true,
        match: /^[a-zA-Z\s]+$/
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true
    },
    nic: {
        type: String,
        required: true,
        match: /^(?:\d{10}|\d{9}[vV])$/
    },
    mobile: {
        type: String,
        required: true,
        match: /^\d{10}$/
    },
    address: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9\s,.-]+$/
    },
    department: {
        type: String,
        required: true,
        enum: ['Farm', 'Factory', 'Outsiders', 'Delivery', 'Vetinary', 'Lab', 'other primary providers', 'Support services']
    },
    position: {
        type: String,
        required: true,
        match: /^[a-zA-Z\s]+$/
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

// Hash password before saving
EmployeeSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
EmployeeSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("employee", EmployeeSchema); 