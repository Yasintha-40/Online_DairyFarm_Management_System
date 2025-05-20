import express from 'express';
import Cow from '../models/cowModel.js';  
import * as cowController from '../controllers/cowControllers.js';  

const router = express.Router();

router.get("/", cowController.getAllCows);
router.post("/", cowController.addCows);
router.get("/:id", cowController.getById);
router.put("/:id", cowController.updateCow);
router.delete("/:id", cowController.deleteCow);

export default router;  // Use export default for ES Modules
