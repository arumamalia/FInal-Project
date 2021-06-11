const express = require("express"); // Import express
const router = express.Router(); // Make a router

// Import controller
const invoiceController = require("../controllers/invoiceController");

//Import Validator
const invoiceValidator = require("../middlewares/validators/invoiceValidator");

router.get("/", invoiceController.getAll);
router.get("/one", invoiceController.getOne);
router.post("/", invoiceValidator.create, invoiceController.create);
router.put("/", invoiceValidator.update, invoiceController.update);
router.delete("/delete", invoiceController.delete);

module.exports = router; // Export router
