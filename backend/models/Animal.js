import mongoose from "mongoose";

const AnimalSchema = new mongoose.Schema({
    animalid: {
        type: String,
        required: true,
        unique: true
    },
    breed: {
        type: String,
        required: [true, 'Breed is required']
    },
    dob: {
        type: String,
        required: [true, 'Date of birth is required']
    },
    weight: {
        type: String,
        required: [true, 'Weight is required']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: {
            values: ['Male', 'Female'],
            message: 'Gender must be either Male or Female'
        }
    },
    health: {
        type: String,
        required: [true, 'Health status is required']
    }
}, {
    timestamps: true
});

// Auto-increment animalid with BUF prefix
AnimalSchema.pre('save', async function(next) {
    try {
        // Find the last animal and get its ID
        const lastAnimal = await this.constructor.findOne({}, {}, { sort: { 'animalid': -1 } });
        
        if (lastAnimal && lastAnimal.animalid) {
            // Extract the number from the last animalid (e.g., "BUF001" -> 1)
            const lastNumber = parseInt(lastAnimal.animalid.replace('BUF', ''));
            if (!isNaN(lastNumber)) {
                const newNumber = lastNumber + 1;
                this.animalid = `BUF${newNumber.toString().padStart(3, '0')}`;
            } else {
                this.animalid = 'BUF001';
            }
        } else {
            // If no animals exist, start with BUF001
            this.animalid = 'BUF001';
        }

        // Verify the ID is unique
        const existingAnimal = await this.constructor.findOne({ animalid: this.animalid });
        if (existingAnimal) {
            // If ID exists, find the next available ID
            let counter = 1;
            let newId;
            do {
                newId = `BUF${(parseInt(this.animalid.replace('BUF', '')) + counter).toString().padStart(3, '0')}`;
                const exists = await this.constructor.findOne({ animalid: newId });
                if (!exists) {
                    this.animalid = newId;
                    break;
                }
                counter++;
            } while (counter < 1000); // Safety limit
        }
        next();
    } catch (error) {
        console.error('Error generating animal ID:', error);
        next(error);
    }
});

export default mongoose.model("Animal", AnimalSchema); 