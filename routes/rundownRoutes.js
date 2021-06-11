const express = require("express"); // Import express
const router = express.Router(); // Make a router

// Import controller
const rundownController = require("../controllers/rundownController");
const auth = require("../middlewares/auth");
const rundownValidator = require("../middlewares/validators/rundownValidator");

// Get All
router.get("/", auth.photographer, rundownController.getAll);
router.get(
  "/one",
  auth.photographer,
  rundownValidator.getOne,
  rundownController.getOne
);
router.post(
  "/",
  auth.photographer,
  rundownValidator.create,
  rundownController.create
);
router.put(
  "/",
  auth.photographer,
  rundownValidator.update,
  rundownController.update
);
router.delete(
  "/delete",
  auth.photographer,
  rundownValidator.delete,
  rundownController.delete
);

module.exports = router; // Export router
