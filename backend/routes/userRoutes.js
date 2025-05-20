import express from "express";
import { loginUser, registerUser, getUserProfile, updateUser, deleteUser, getAllUsers, updateUserByAdmin, deleteUserByAdmin } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", authMiddleware, getUserProfile);
userRouter.put("/update/:id", authMiddleware, updateUser);
userRouter.delete("/delete", authMiddleware, deleteUser);

// 🌟 Admin Routes
userRouter.get("/all", authMiddleware, getAllUsers);
userRouter.put("/admin/update", authMiddleware, updateUserByAdmin);
userRouter.post("/admin/delete", authMiddleware, deleteUserByAdmin);

export default userRouter;
