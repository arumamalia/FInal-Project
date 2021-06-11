const express = require("express"); // Import express
const router = express.Router(); // Make a router

// Import controller
const detailInvoiceController = require("../controllers/detailInvoiceController");

//Import validator
const detailInvoiceValidator = require("../middlewares/validators/detailInvoiceValidator");

router.get("/", detailInvoiceController.getAll);
router.get("/one", detailInvoiceController.getOne);
router.post("/", detailInvoiceValidator.create, detailInvoiceController.create);
router.post("/addPackage", detailInvoiceController.addPackage);
router.put("/", detailInvoiceValidator.update, detailInvoiceController.update);
router.delete("/delete", detailInvoiceController.delete);

module.exports = router; // Export router
