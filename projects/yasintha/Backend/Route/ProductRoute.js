const express = require("express");
const router = express.Router();
//Insert Model
const product = require("../Model/ProductModel")
//Insert Product Controller
const ProductControllers = require("../Controllers/ProductControllers");

router.get("/",ProductControllers.getAllproducts);
router.post("/",ProductControllers.addproducts);
router.get("/:id",ProductControllers.getById);
router.put("/:id",ProductControllers.updateproducts);
router.delete("/:id",ProductControllers.deleteproducts);

//export
module.exports = router;