const Cow = require ("../Model/cowModel");

//Data display
const getAllCows = async(req, res, next) => {
    let cows;
    //get alla cows
    try {
        cows = await Cow.find();
    } catch (err) {
        console.log(err);
    }
    // not display cows
    if(!cows){
        return res.status(404).json({message: "cow not found"});
    }
    // Display all cows
    return res.status(200).json({cows});
};

//Data insert
const addCows = async(req, res, next) =>{

    const {animal_id,status,disease_name,vaccine_name,vaccination_date} = req.body;
    let cows;

    try{
        cows = new Cow({animal_id,status,disease_name,vaccine_name,vaccination_date});
        await cows.save();
    }catch(err){
        console.log(err);
    }
    //not insert users
    if(!cows){
        return res.status(404).json({message:"unable to add cows"});
    }
    return res.status(200).json({cows});
};

//Get by id
const getById = async (req, res,next) => {

    const id = req.params.id;
    let cow;

    try{
        cow = await Cow.findById(id);
    }catch(err){
        console.log(err);
    }
    //not available users
    if(!cow){
        return res.status(404).json({message:"cow not found"});
    }
    return res.status(200).json({cow});
};

//Update user details 
const updateCow = async (req, res, next) => {
    const id = req.params.id;
    const {animal_id,status,disease_name,vaccine_name,vaccination_date} = req.body;

    let cows;

    try {
        cows = await Cow.findByIdAndUpdate(id,
            {animal_id:animal_id,status:status,disease_name:disease_name,vaccine_name:vaccine_name,vaccination_date:vaccination_date});
            cows = await cows.save();
    } catch (err) {
        console.log(err);  
    }
    if(!cows){
        return res.status(404).json({message:"unable to update cow details"});
    }
    return res.status(200).json({cows});
};

//Delete user Details
const deleteCow = async (req, res, next) => {
    const id = req.params.id;

    let cow;

    try {
        cow = await Cow.findByIdAndDelete(id)
    } catch (err) {
        console.log(err);
    }
    if(!cow){
        return res.status(404).json({message:"unable to delete"});
    }
    return res.status(200).json({cow});
};


exports.getAllCows = getAllCows;
exports.addCows = addCows;
exports.getById = getById;
exports.updateCow = updateCow;
exports.deleteCow = deleteCow;