const express = require("express");

const router = express.Router();

const Animals = require("../models/Animal");

//testing 
router.get("/test",(req,res)=>res.send("animal routes working"));

//Inserting data
router.post("/", async (req, res) => {
    try {
        // Validate required fields
        if (!req.body.breed || !req.body.dob || !req.body.weight || !req.body.gender || !req.body.health) {
            return res.status(400).json({
                message: "Missing required fields",
                details: "All fields (breed, dob, weight, gender, health) are required"
            });
        }

        // Create new animal with initial animalid
        const newAnimal = new Animals({
            animalid: 'BUF001', // Set initial ID
            breed: req.body.breed,
            dob: req.body.dob,
            weight: req.body.weight,
            gender: req.body.gender,
            health: req.body.health
        });

        // Save the animal
        const savedAnimal = await newAnimal.save();
        res.status(201).json(savedAnimal);
    } catch (error) {
        console.error('Error adding animal:', error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: "Validation error", 
                details: validationErrors
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "Duplicate animal ID", 
                error: "An animal with this ID already exists"
            });
        }
        
        res.status(400).json({ 
            message: "Failed to add animal", 
            error: error.message
        });
    }
});

//Display
router.get("/", async (req, res) => {
    try {
        const animals = await Animals.find().sort({ animalid: 1 });
        res.json(animals);
    } catch (error) {
        console.error('Error fetching animals:', error);
        res.status(400).json({ message: "No animals found", error: error.message });
    }
});

//Get by id
router.get("/:id", async (req, res) => {
    try {
        const animal = await Animals.findById(req.params.id);
        if (animal) {
            res.json(animal);
        } else {
            res.status(404).json({ message: "Could not find this animal" });
        }
    } catch (error) {
        console.error('Error finding animal:', error);
        res.status(400).json({ message: "Could not find this animal", error: error.message });
    }
});

//update
router.put("/:id", async (req, res) => {
    try {
        const updatedAnimal = await Animals.findByIdAndUpdate(
            req.params.id,
            {
                breed: req.body.breed,
                dob: req.body.dob,
                weight: req.body.weight,
                gender: req.body.gender,
                health: req.body.health
            },
            { new: true, runValidators: true }
        );
        if (updatedAnimal) {
            res.json(updatedAnimal);
        } else {
            res.status(404).json({ message: "Animal not found" });
        }
    } catch (error) {
        console.error('Error updating animal:', error);
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: "Validation error", 
                details: validationErrors
            });
        }
        res.status(400).json({ message: "Update failed", error: error.message });
    }
});

//delete
router.delete("/:id", async (req, res) => {
    try {
        const deletedAnimal = await Animals.findByIdAndDelete(req.params.id);
        if (deletedAnimal) {
            res.json({ message: "Deleted successfully" });
        } else {
            res.status(404).json({ message: "Animal not found" });
        }
    } catch (error) {
        console.error('Error deleting animal:', error);
        res.status(400).json({ message: "Cannot be deleted", error: error.message });
    }
});

module.exports = router;