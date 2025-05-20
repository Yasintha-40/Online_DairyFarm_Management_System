import userModel from "../models/userModel.js"

// add items to user cart
const addTocart = async (req, res) => {
    try {
        const userId = req.userId; // Get user ID from auth middleware
        let userData = await userModel.findById(userId);
        
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};
        
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Added to Cart", cartData });
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ success: false, message: "Failed to add item to cart" });
    }
}

//remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.userId; // Get user ID from auth middleware
        let userData = await userModel.findById(userId);
        
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};

        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
            if (cartData[req.body.itemId] === 0) {
                delete cartData[req.body.itemId];
            }
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Removed from Cart", cartData });
    } catch (error) {
        console.error("Remove from cart error:", error);
        res.status(500).json({ success: false, message: "Failed to remove item from cart" });
    }
}

//fetch user cart data
const getCart = async (req, res) => {
    try {
        const userId = req.userId; // Get user ID from auth middleware
        let userData = await userModel.findById(userId);
        
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData || {};
        res.json({ success: true, cartData });
    } catch (error) {
        console.error("Get cart error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch cart data" });
    }
}

export { addTocart, removeFromCart, getCart }