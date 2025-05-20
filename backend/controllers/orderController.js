import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Placing user order
const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error placing order" });
  }
};

// Getting user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

//list order for admin
const listOrders = async(rq,res)=>{

  try {
    const orders = await orderModel.find({}).populate('userId');
    res.json({success:true,data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
  }

}

//api for updating order status
const updateStatus = async (req,res)=>{

  try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
    res.json({success:true,message:"Status updated"})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
    
  }
}

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await orderModel.findByIdAndDelete(orderId);
    
    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting order" });
  }
};

export { placeOrder, getUserOrders,listOrders,updateStatus,deleteOrder };
