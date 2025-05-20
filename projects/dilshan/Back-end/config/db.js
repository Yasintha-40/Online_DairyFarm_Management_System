zconst mongoose = require("mongoose");

const dburl = "mongodb+srv://dilshanmahavithana:iamkaluu7.@cluster0.lgrfy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.set("strictQuery",true,"useNewUrlParser",true);

const connection = async () => {
    try {
        await mongoose.connect(dburl);
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error(e.message);
        process.exit();
    }
};

module.exports = connection;