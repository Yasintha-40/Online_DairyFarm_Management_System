const express = require("express");
const router = express.Router();
const Vaccine = require("../Model/vaccineModel");//insert model
const vaccineController = require("../Controllers/vaccineControllers"); //insert user controller

router.get("/", vaccineController.getAllVaccines);
router.post("/", vaccineController.addVaccines);
router.get("/:id", vaccineController.getById);
router.put("/:id", vaccineController.updateVaccine);
router.delete("/:id", vaccineController.deleteVaccine);
router.get("/vaccines",vaccineController.getVaccineName);

//export
module.exports = router;