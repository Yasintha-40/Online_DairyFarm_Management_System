const express = require("express");
const dbConnection = require("./config/db");
const animalRoutes = require("./routes/animals");
const serviceRoutes = require("./routes/services");
const animalServiceRoutes = require("./routes/animalServices");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors({origin:true, credentials: true}));    //security enhancement

//DB connection
dbConnection();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",(req,res)=>res.send("Hello world"));
app.use("/api/animals", animalRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/animal-services", animalServiceRoutes);

const PORT = 3000;

app.listen(PORT,()=>console.log('server running on PORT ${PORT}'));
