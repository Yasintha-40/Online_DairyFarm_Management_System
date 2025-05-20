import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dilkikaveesha003@gmail.com',
    pass: 'Dilki2003',
  }
});

// Create JWT Token
const createToken = (id) => {
  // Use a fallback secret if environment variable is not set
  const secret = process.env.JWT_SECRET || 'dairyfarmsecretkey123';
  return jwt.sign({ id }, secret);
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid email or password" });

    const token = createToken(user._id);
    res.status(200).json({ success: true, token, role: user.role, message: `Logged in as ${user.role}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

// Register
const registerUser = async (req, res) => {
  const { name, password, phone, email } = req.body;
  try {
    const exists = await userModel.findOne({ email });
    if (exists) return res.json({ success: false, message: "User already exists" });

    if (!validator.isEmail(email)) return res.json({ success: false, message: "Please enter a valid email" });
    if (password.length < 8) return res.json({ success: false, message: "Please enter a strong password" });
    if (phone.length !== 10) return res.status(400).json({ success: false, message: "Phone number should be exactly 10 digits" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword, phone });
    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Get logged-in user's profile
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update own profile
const updateUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "Invalid email format" });
    if (phone.length !== 10) return res.status(400).json({ success: false, message: "Phone must be 10 digits" });

    const updatedUser = await userModel.findByIdAndUpdate(req.userId, { name, email, phone }, { new: true });
    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "User updated", data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

// Delete own profile
const deleteUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "User account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🌟 Admin - Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// 🌟 Admin - Update any user's info
const updateUserByAdmin = async (req, res) => {
  try {
    const { userId, name, email, phone, role } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(userId, { name, email, phone, role }, { new: true });
    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

// 🌟 Admin - Delete user
const deleteUserByAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    await userModel.findByIdAndDelete(userId);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

export { loginUser, registerUser, getUserProfile, updateUser, deleteUser, getAllUsers, updateUserByAdmin, deleteUserByAdmin };
