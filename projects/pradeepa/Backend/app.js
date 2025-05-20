const express = require("express");
const mongoose = require("mongoose");
const router1 = require("./Routes/cowRoutes")
const router2 = require("./Routes/vaccineRoutes")

const app = express();
const cors = require("cors");

//middle ware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use("/cows", router1);
app.use("/vaccines", router2);

mongoose.connect("mongodb+srv://Dilki:123456%23@cluster0.wvqgoif.mongodb.net/dairy-farm") 
.then(() => console.log("connected to mongoDB"))
.then(() =>{
    app.listen(5005); 
})
.catch((err) => console.log((err)));