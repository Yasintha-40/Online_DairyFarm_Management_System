import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const vaccineSchema = new Schema({
    vaccine_id: { 
        type: String, 
        required: true, 
        unique: true 
    },
    vaccine_name: {
        type: String
    },
    disease_name: {
        type: String
    },
    target: { 
        type: String, 
        enum: ['Three_Month', 'Six_Month', 'Any'], 
        required: true 
    },
    description: { 
        type: String
    }
});

const Vaccine = mongoose.model('animal_vaccines_records', vaccineSchema);
export default Vaccine;