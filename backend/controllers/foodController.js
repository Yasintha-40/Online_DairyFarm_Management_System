import { log } from "console";
import foodModel from "../models/foodmodel.js";
import fs from 'fs';

//add food item

const addFood = async (req,res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        const { productId, name, description, price, category, manufactureDate, expireDate } = req.body;

        // Validate required fields
        if (!productId || !name || !description || !price || !category || !manufactureDate || !expireDate) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        // Validate price is a number
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Price must be a positive number" 
            });
        }

        const image_filename = req.file.filename;

        const food = new foodModel({
            productId,
            name,
            description,
            price: Number(price),
            category,
            image: image_filename,
            manufactureDate: new Date(manufactureDate),
            expireDate: new Date(expireDate)
        });

        await food.save();
        res.json({ 
            success: true, 
            message: "Food Added Successfully",
            data: food
        });

    } catch (error) {
        console.error("Add food error:", error);
        // If there's an error, delete the uploaded file
        if (req.file) {
            fs.unlink(`uploads/${req.file.filename}`, () => {});
        }
        res.status(500).json({ 
            success: false, 
            message: "Failed to add food item" 
        });
    }
}

//all food list

const listFood = async (req,res)=>{
    try {
        const foods = await foodModel.find({});
        res.json({ 
            success: true, 
            data: foods 
        });
    } catch (error) {
        console.error("List food error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch food items" 
        });
    }
}

// remove food item

const removeFood = async (req,res) =>{
    try {
        const food = await foodModel.findById(req.body.id);
        
        if (!food) {
            return res.status(404).json({ 
                success: false, 
                message: "Food item not found" 
            });
        }

        // Delete the image file
        fs.unlink(`uploads/${food.image}`, (err) => {
            if (err) {
                console.error("Error deleting image:", err);
            }
        });

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ 
            success: true, 
            message: "Food Removed Successfully" 
        });

    } catch (error) {
        console.error("Remove food error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to remove food item" 
        });
    }
}

// update food item
const updateFood = async (req, res) => {
    try {
        const { id, productId, name, description, price, category, manufactureDate, expireDate } = req.body;
        
        // Validate required fields
        if (!id || !productId || !name || !description || !price || !category || !manufactureDate || !expireDate) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        // Validate price is a number
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Price must be a positive number" 
            });
        }

        // Find the food item
        const food = await foodModel.findById(id);
        
        if (!food) {
            return res.status(404).json({ 
                success: false, 
                message: "Food item not found" 
            });
        }

        // Update the food item
        food.productId = productId;
        food.name = name;
        food.description = description;
        food.price = Number(price);
        food.category = category;
        food.manufactureDate = new Date(manufactureDate);
        food.expireDate = new Date(expireDate);

        // If a new image is provided, update it
        if (req.file) {
            // Delete the old image
            fs.unlink(`uploads/${food.image}`, (err) => {
                if (err) {
                    console.error("Error deleting old image:", err);
                }
            });
            
            // Set the new image
            food.image = req.file.filename;
        }

        await food.save();
        
        res.json({ 
            success: true, 
            message: "Food Updated Successfully",
            data: food
        });

    } catch (error) {
        console.error("Update food error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to update food item" 
        });
    }
}

export {addFood,listFood,removeFood,updateFood}