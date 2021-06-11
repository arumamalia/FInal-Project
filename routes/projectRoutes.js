const express = require("express"); // Import express
const router = express.Router(); // Make a router

// Import controller
const projectController = require("../controllers/projectController");
const auth = require("../middlewares/auth");
const projectValidator = require("../middlewares/validators/projectValidator");

// Get All
router.get("/", auth.photographer, projectController.getAll);
router.get("/search", auth.photographer, projectController.search);
router.get(
  "/one",
  auth.photographer,
  projectValidator.getOne,
  projectController.getOne
);
router.get("/filter", auth.photographer, projectController.filterCompleted);
router.post(
  "/",
  auth.photographer,
  projectValidator.create,
  projectController.create
);
router.put(
  "/",
  auth.photographer,
  projectValidator.update,
  projectController.update
);
router.delete(
  "/delete",
  auth.photographer,
  projectValidator.delete,
  projectController.delete
);

router.put("/addPackage", auth.photographer, projectController.addPackage);
module.exports = router; // Export router
