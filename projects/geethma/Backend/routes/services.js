const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Get all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find().sort({ serviceId: 1 });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new service
router.post('/', async (req, res) => {
    const service = new Service({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        isNotified: false
    });

    try {
        const newService = await service.save();
        res.status(201).json(newService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a specific service
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findOne({ serviceId: req.params.id });
        if (service) {
            res.json(service);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a service
router.patch('/:id', async (req, res) => {
    try {
        const service = await Service.findOne({ serviceId: req.params.id });
        if (service) {
            if (req.body.name) service.name = req.body.name;
            if (req.body.description) service.description = req.body.description;
            if (req.body.price) service.price = req.body.price;
            if (req.body.isNotified !== undefined) service.isNotified = req.body.isNotified;
            
            const updatedService = await service.save();
            res.json(updatedService);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a service
router.delete('/:id', async (req, res) => {
    try {
        const service = await Service.findOne({ serviceId: req.params.id });
        if (service) {
            await service.remove();
            res.json({ message: 'Service deleted' });
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 