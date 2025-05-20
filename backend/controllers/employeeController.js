import employeeModel from "../models/employeeModel.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Create JWT Token
const createToken = (employee) => {
    return jwt.sign({ email: employee.email }, process.env.JWT_SECRET);
};

// Employee Login
const loginEmployee = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log("Attempting login for email:", email);
        const employee = await employeeModel.findOne({ email });
        console.log("Found employee:", employee ? "Yes" : "No");
        
        if (!employee) {
            console.log("No employee found with email:", email);
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await employee.comparePassword(password);
        console.log("Password match:", isMatch ? "Yes" : "No");
        
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const token = createToken(employee);
        console.log("Login successful for:", email);
        res.status(200).json({
            success: true,
            token,
            role: "employee",
            message: "Logged in successfully"
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error during login" });
    }
};

// Add a new employee
const addEmployee = async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['employeeId', 'name', 'email', 'password', 'nic', 'mobile', 'address', 'department', 'position', 'gender', 'birthdate'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Validate employeeId format
        if (!/^[a-zA-Z0-9]{10}$/.test(req.body.employeeId)) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID must be exactly 10 characters (letters and numbers only)'
            });
        }

        // Validate name format
        if (!/^[a-zA-Z\s]+$/.test(req.body.name)) {
            return res.status(400).json({
                success: false,
                message: 'Name can only contain letters and spaces'
            });
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        // Validate NIC format
        if (!/^(?:\d{10}|\d{9}[vV])$/.test(req.body.nic)) {
            return res.status(400).json({
                success: false,
                message: 'NIC must be either 10 digits or 9 digits followed by V/v'
            });
        }

        // Validate mobile format
        if (!/^\d{10}$/.test(req.body.mobile)) {
            return res.status(400).json({
                success: false,
                message: 'Mobile number must be exactly 10 digits'
            });
        }

        // Validate department
        const validDepartments = ['Farm', 'Factory', 'Outsiders', 'Delivery', 'Vetinary', 'Lab', 'other primary providers', 'Support services'];
        if (!validDepartments.includes(req.body.department)) {
            return res.status(400).json({
                success: false,
                message: `Department must be one of: ${validDepartments.join(', ')}`
            });
        }

        // Validate position format
        if (!/^[a-zA-Z\s]+$/.test(req.body.position)) {
            return res.status(400).json({
                success: false,
                message: 'Position can only contain letters and spaces'
            });
        }

        // Validate gender
        const validGenders = ['Male', 'Female', 'Other'];
        if (!validGenders.includes(req.body.gender)) {
            return res.status(400).json({
                success: false,
                message: `Gender must be one of: ${validGenders.join(', ')}`
            });
        }

        // Check if employeeId or email already exists
        const existingEmployee = await employeeModel.findOne({
            $or: [
                { employeeId: req.body.employeeId },
                { email: req.body.email }
            ]
        });
        
        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                message: existingEmployee.employeeId === req.body.employeeId 
                    ? 'Employee ID already exists' 
                    : 'Email already exists'
            });
        }

        // Create employee record
        const employee = new employeeModel(req.body);
        await employee.save();

        // Create user account with role "employee"
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
        const user = new userModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.mobile,
            role: "employee"
        });
        await user.save();

        res.json({ success: true, message: "Employee added successfully", data: employee });
    } catch (error) {
        console.error("Add employee error:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(err => err.message).join(', ')
            });
        }
        res.status(500).json({ success: false, message: "Failed to add employee" });
    }
};

// Get all employees
const getEmployees = async (req, res) => {
    try {
        console.log("Fetching all employees");
        const employees = await employeeModel.find();
        console.log("Found employees:", employees);
        res.json({ success: true, data: employees });
    } catch (error) {
        console.error("Get employees error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch employees" });
    }
};

// Get employee by ID
const getEmployeeById = async (req, res) => {
    try {
        const employee = await employeeModel.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }
        res.json({ success: true, data: employee });
    } catch (error) {
        console.error("Get employee error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch employee" });
    }
};

// Update employee
const updateEmployee = async (req, res) => {
    try {
        let employee;
        if (req.params.id) {
            employee = await employeeModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        } else if (req.params.email) {
            employee = await employeeModel.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
        }

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }
        res.json({ success: true, message: "Employee updated successfully", data: employee });
    } catch (error) {
        console.error("Update employee error:", error);
        res.status(500).json({ success: false, message: "Failed to update employee" });
    }
};

// Delete employee
const deleteEmployee = async (req, res) => {
    try {
        const employee = await employeeModel.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }
        res.json({ success: true, message: "Employee deleted successfully" });
    } catch (error) {
        console.error("Delete employee error:", error);
        res.status(500).json({ success: false, message: "Failed to delete employee" });
    }
};

// Get employee by email
const getEmployeeByEmail = async (req, res) => {
    try {
        console.log("Searching for employee with email:", req.params.email);
        const employee = await employeeModel.findOne({ email: req.params.email });
        console.log("Found employee:", employee);
        
        if (!employee) {
            console.log("No employee found with email:", req.params.email);
            return res.status(404).json({ success: false, message: "Employee not found" });
        }
        res.json({ success: true, data: employee });
    } catch (error) {
        console.error("Get employee error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch employee" });
    }
};

export { addEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee, loginEmployee, getEmployeeByEmail }; 