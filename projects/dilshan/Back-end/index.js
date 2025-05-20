const express = require('express');
const dbConnection = require("./config/db");
const routes = require("./routes/employees");
const  cors = require("cors");
const bodyParser = require("body-parser");
const routes1 = require("./routes/tasks");

const app = express();
app.use(cors({origin: true, credentials: true}));

//db connection
dbConnection();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.get("/", (req, res) =>res.send("Hello server is running"));
app.use("/api/employees",routes);
app.use("/api/tasks",routes1);

const PORT = 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
