const express = require("express");
const mongoose = require("mongoose");
const router = require("./Route/ProductRoute");

const app = express();
const cors = require("cors");

//Middleware

app.use(express.json());
app.use(cors());
app.use("/products",router)

mongoose.connect("mongodb+srv://yasintha:TowxmakBtAj8XBwu@cluster0.pwu2m.mongodb.net/")
.then(()=>console.log("Connect to the MongoDB"))
.then(()=> { 
    app.listen(5000, () => {
        console.log("Server running on port 5000");
    });
})
.catch((err)=> console.log((err)));
