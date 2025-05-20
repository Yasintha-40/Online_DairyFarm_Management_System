const Vaccine = require ("../Model/vaccineModel");

//Data display
const getAllVaccines = async(req, res, next) => {
    let vaccines;
    //get alla vaccines
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
const addVaccines = async(req, res, next) =>{

    const {vaccine_id,vaccine_name,disease_name,target,description} = req.body;
    let vaccines;

    try{
        vaccines = new Vaccine({vaccine_id,vaccine_name,disease_name,target,description});
        await vaccines.save();
    }catch(err){
        console.log(err);
    }
    //not insert users
    if(!vaccines){
        return res.status(404).json({message:"unable to add vaccines"});
    }
    return res.status(200).json({vaccines});
};

//Get by id
const getById = async (req, res,next) => {

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
const updateVaccine = async (req, res, next) => {
    const id = req.params.id;
    const {vaccine_id,vaccine_name,disease_name,target,description} = req.body;

    let vaccines;

    try {
        vaccines = await Vaccine.findByIdAndUpdate(id,
            {vaccine_id:vaccine_id,vaccine_name:vaccine_name,disease_name:disease_name,target:target,description:description});
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
const deleteVaccine = async (req, res, next) => {
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
const getVaccineName = async (req, res) => {

    try {
        const vaccines = await Vaccine.find({}, "vaccine_name"); // Only get vaccine_name field
        res.json({ vaccines });
    } catch (err) {
        res.status(500).json({ message: err.message });
      }
};

exports.getAllVaccines = getAllVaccines;
exports.addVaccines = addVaccines;
exports.getById = getById;
exports.updateVaccine = updateVaccine;
exports.deleteVaccine = deleteVaccine;
exports.getVaccineName = getVaccineName;