import express from "express";
import { getUserOrders, listOrders, placeOrder, updateStatus, deleteOrder } from "../controllers/orderController.js";
import { authMiddleware } from "../middleware/auth.js";

const orderRouter = express.Router();

// Place order (needs token)
orderRouter.post("/place", authMiddleware, placeOrder);

// Get user's orders (needs token)
orderRouter.get("/user-orders", authMiddleware, getUserOrders);
orderRouter.get('/list',listOrders)
orderRouter.post('/status',updateStatus)
orderRouter.delete('/:id', deleteOrder)

export default orderRouter;
