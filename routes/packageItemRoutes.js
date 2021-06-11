const express = require("express"); // Import express
const router = express.Router(); // Make a router

// Import controller
const packageItemController = require("../controllers/packageItemController");

//import validator
const packageItemValidator = require("../middlewares/validators/packageItemValidator");

router.get("/", packageItemController.getAll);
router.get("/one", packageItemController.getOne);
router.get("/byPackage", packageItemController.getByPackage);
router.post("/", packageItemValidator.create, packageItemController.create);
router.put("/", packageItemValidator.update, packageItemController.update);
router.delete("/delete", packageItemController.delete);

module.exports = router; // Export router
