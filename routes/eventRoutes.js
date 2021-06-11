const express = require("express"); // Import express
const router = express.Router(); // Make a router

// Import controller
const eventController = require("../controllers/eventController");
const auth = require("../middlewares/auth");
const eventValidator = require("../middlewares/validators/eventValidator");

// Get All
router.get("/", auth.photographer, eventController.getAll);
router.get(
  "/one",
  auth.photographer,
  eventValidator.getOne,
  eventController.getOne
);
router.post(
  "/",
  auth.photographer,
  eventValidator.create,
  eventController.create
);
router.put(
  "/",
  auth.photographer,
  eventValidator.update,
  eventController.update
);
router.delete(
  "/delete",
  auth.photographer,
  eventValidator.delete,
  eventController.delete
);

module.exports = router; // Export router
