const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cowSchema = new Schema({
    animal_id: { 
        type: String, 
        required: true, 
         
    },
    status: { 
        type: String, 
        enum: ['Healthy', 'Sick', 'Recovered', 'Vaccinated'], 
        required: true 
    },
    disease_name: {
        type: String ,
    },
    vaccine_name: {
        type: String,
    },
    vaccination_date: { 
        type: String, 
    },
    
});

module.exports = mongoose.model(
    "AnimalHealthRecord",//file name
    cowSchema // function name
    

)