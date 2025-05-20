import express from 'express';
import AnimalService from '../models/AnimalService.js';

const router = express.Router();

// Get all animal services
router.get('/', async (req, res) => {
    try {
        const animalServices = await AnimalService.find().sort({ createdAt: -1 });
        res.json(animalServices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reset service IDs
router.post('/reset-ids', async (req, res) => {
    try {
        // Get all services sorted by creation date
        const services = await AnimalService.find().sort({ createdAt: 1 });
        
        // Update each service with a new sequential ID
        for (let i = 0; i < services.length; i++) {
            await AnimalService.findByIdAndUpdate(services[i]._id, { serviceId: i + 1 });
        }
        
        res.json({ message: 'Service IDs have been reset successfully' });
    } catch (error) {
        console.error('Error resetting service IDs:', error);
        res.status(500).json({ message: 'Failed to reset service IDs', error: error.message });
    }
});

// Add a new animal service
router.post('/', async (req, res) => {
    const animalService = new AnimalService({
        animalId: req.body.animalId,
        dob: req.body.dob,
        age: req.body.age,
        serviceType: req.body.serviceType,
        notes: req.body.notes
    });

    try {
        const newAnimalService = await animalService.save();
        res.status(201).json(newAnimalService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update an animal service
router.patch('/:id', async (req, res) => {
    try {
        const animalService = await AnimalService.findById(req.params.id);
        if (animalService) {
            if (req.body.animalId) animalService.animalId = req.body.animalId;
            if (req.body.age) animalService.age = req.body.age;
            if (req.body.serviceType) animalService.serviceType = req.body.serviceType;
            if (req.body.status) animalService.status = req.body.status;
            if (req.body.notes !== undefined) animalService.notes = req.body.notes;
            if (req.body.isNotified !== undefined) animalService.isNotified = req.body.isNotified;
            
            const updatedAnimalService = await animalService.save();
            res.json(updatedAnimalService);
        } else {
            res.status(404).json({ message: 'Animal service not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an animal service
router.delete('/:id', async (req, res) => {
    try {
        const animalService = await AnimalService.findById(req.params.id);
        if (animalService) {
            await AnimalService.deleteOne({ _id: req.params.id });
            res.json({ message: 'Animal service deleted' });
        } else {
            res.status(404).json({ message: 'Animal service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router; 