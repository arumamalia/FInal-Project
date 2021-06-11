const express = require("express"); // Import express
const router = express.Router(); // Make a router

// Import controller
const categoryController = require("../controllers/categoryController");

//Import Validator
const categoryValidator = require("../middlewares/validators/categoryValidator");

router.get("/", categoryController.getAll);
router.get("/one", categoryController.getOne);
router.post("/", categoryValidator.create, categoryController.create);
router.put("/", categoryValidator.update, categoryController.update);
router.delete("/delete", categoryController.delete);

module.exports = router; // Export router
