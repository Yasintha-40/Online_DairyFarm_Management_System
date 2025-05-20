import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "Order processing" },
  createdAt: { type: Date, default: Date.now }
});

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default orderModel;
