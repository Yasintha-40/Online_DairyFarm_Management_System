const mongoose = require('mongoose');

const animalServiceSchema = new mongoose.Schema({
    serviceId: {
        type: Number,
        required: true,
        unique: true,
        default: 1
    },
    animalId: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    serviceType: {
        type: String,
        required: true,
        enum: ['Veterinary Checkup', 'Hoof Check', 'Breeding Check', 'Tag Check']
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    isNotified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-increment serviceId
animalServiceSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            // Find the last service and get its ID
            const lastService = await this.constructor.findOne({}, {}, { sort: { 'serviceId': -1 } });
            this.serviceId = lastService ? lastService.serviceId + 1 : 1;
        } catch (error) {
            console.error('Error generating service ID:', error);
            this.serviceId = 1; // Start from 1 if there's an error
        }
    }
    next();
});

module.exports = mongoose.model('AnimalService', animalServiceSchema); 