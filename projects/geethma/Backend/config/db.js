const mongoose = require("mongoose");

const dburl = "mongodb+srv://Geethma:200275600895@cluster0.rvfnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.set("strictQuery",true,"useNewUrlParser",true);

const connection = async()=>{

    try{
        await mongoose.connect(dburl);
        console.log("Mongo DB connected");
    }catch(e) {
        console.error(e.message);
        process.exit();
    }
  
};

module.exports = connection;