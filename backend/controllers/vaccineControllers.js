import Vaccine from '../models/vaccineModel.js';

//Data display
export const getAllVaccines = async(req, res, next) => {
    let vaccines;
    //get all vaccines
    try {
        vaccines = await Vaccine.find();
    } catch (err) {
        console.log(err);
    }
    // not display vaccines
    if(!vaccines){
        return res.status(404).json({message: "vaccine not found"});
    }
    // Display all vaccines
    return res.status(200).json({vaccines});
};

//Data insert
export const addVaccines = async (req, res) => {
    try {
        const { vaccine_id, vaccine_name, disease_name, target, description } = req.body;
        
        // Validate the inputs (if necessary)
        if (!vaccine_id || !vaccine_name || !disease_name) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // Create a new vaccine in the database
        const newVaccine = new Vaccine({
            vaccine_id,
            vaccine_name,
            disease_name,
            target,
            description
        });
        
        await newVaccine.save();
        
        res.status(201).json(newVaccine); // Respond with the newly created vaccine
    } catch (error) {
        console.error("Error adding vaccine:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//Get by id
export const getById = async (req, res, next) => {
    const id = req.params.id;
    let vaccine;

    try{
        vaccine = await Vaccine.findById(id);
    }catch(err){
        console.log(err);
    }
    //not available users
    if(!vaccine){
        return res.status(404).json({message:"vaccine not found"});
    }
    return res.status(200).json({vaccine});
};

//Update user details 
export const updateVaccine = async (req, res, next) => {
    const id = req.params.id;
    const {vaccine_id, vaccine_name, disease_name, target, description} = req.body;

    let vaccines;

    try {
        vaccines = await Vaccine.findByIdAndUpdate(id,
            {vaccine_id, vaccine_name, disease_name, target, description});
        vaccines = await vaccines.save();
    } catch (err) {
        console.log(err);  
    }
    if(!vaccines){
        return res.status(404).json({message:"unable to update vaccine details"});
    }
    return res.status(200).json({vaccines});
};

//Delete user Details
export const deleteVaccine = async (req, res, next) => {
    const id = req.params.id;

    let vaccine;

    try {
        vaccine = await Vaccine.findByIdAndDelete(id)
    } catch (err) {
        console.log(err);
    }
    if(!vaccine){
        return res.status(404).json({message:"unable to delete"});
    }
    return res.status(200).json({vaccine});
};

//get vaccine name
export const getVaccineName = async (req, res) => {
    try {
        const vaccines = await Vaccine.find({}, "vaccine_name"); // Only get vaccine_name field
        res.json({ vaccines });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};