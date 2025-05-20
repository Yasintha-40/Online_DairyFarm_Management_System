import express from 'express';
import Vaccine from '../models/vaccineModel.js';
import * as vaccineController from '../controllers/vaccineControllers.js';

const router = express.Router();

router.get("/", vaccineController.getAllVaccines);
router.post("/", vaccineController.addVaccines);
router.get("/:id", vaccineController.getById);
router.put("/:id", vaccineController.updateVaccine);
router.delete("/:id", vaccineController.deleteVaccine);
router.get("/vaccines", vaccineController.getVaccineName);

export default router;