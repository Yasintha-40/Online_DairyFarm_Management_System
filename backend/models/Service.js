import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    serviceId: {
        type: Number,
        required: true,
        unique: true,
        default: 1
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
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
serviceSchema.pre('save', async function(next) {
    if (this.isNew) {
        const lastService = await this.constructor.findOne({}, {}, { sort: { 'serviceId': -1 } });
        this.serviceId = lastService ? lastService.serviceId + 1 : 1;
    }
    next();
});

export default mongoose.model('Service', serviceSchema); 