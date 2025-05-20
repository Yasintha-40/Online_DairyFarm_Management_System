const express = require("express");
const router = express.Router();
const Cow = require("../Model/cowModel");//insert model
const cowController = require("../Controllers/cowControllers"); //insert user controller

router.get("/", cowController.getAllCows);
router.post("/", cowController.addCows);
router.get("/:id", cowController.getById);
router.put("/:id", cowController.updateCow);
router.delete("/:id", cowController.deleteCow);


//export
module.exports = router;