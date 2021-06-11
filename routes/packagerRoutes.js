const express = require("express"); // Import express
const router = express.Router(); // Make a router

// Import middlewares
const packagerValidator = require("../middlewares/validators/packageValidator");

// Import controller
const packagerController = require("../controllers/packagerController");
const auth = require("../middlewares/auth");

router.get("/", auth.photographer, packagerController.getAll);
router.get("/filter", auth.photographer, packagerController.filter);
router.get("/search", auth.photographer, packagerController.search);
router.get("/allPackage", packagerController.getForAllPhotographer);
router.get(
  "/one",
  auth.photographer,
  packagerValidator.getOne,
  packagerController.getOne
);
router.post(
  "/",
  auth.photographer,
  packagerValidator.create,
  packagerController.create
);
router.put(
  "/",
  auth.photographer,
  packagerValidator.update,
  packagerController.update
);
router.delete("/delete", auth.photographer, packagerController.delete);

module.exports = router; // Export router
