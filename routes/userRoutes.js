const express = require("express"); // Import express
const router = express.Router(); // Make a router

// Import validator
const userValidator = require("../middlewares/validators/userValidator");

// Import controller
const userController = require("../controllers/userController");

// Import auth (middleware)
const auth = require("../middlewares/auth");

// If GET (/transaksi), will go to getAll function in transaksiController class
router.get("/", /*auth.photographer,*/ userController.getAll);
// router.get("/", transaksiController.getAll);

// If GET (/transaksi/:id), will go to getOne function in transaksiController
router.get(
  "/one",
  auth.photographer,
  // userValidator.getOne,
  userController.getOne
);

// If POST (/transaksi), will go to transaksiValidator.create first
// If in the transaksiValidator.create can run the next(), it will go to transaksiController.create

// If POST (/transaksi), will go to transaksiValidator.create first
// If in the transaksiValidator.create can run the next(), it will go to transaksiController.create
router.put("/", auth.photographer, userValidator.update, userController.update);

// If DELETE (/transaksi/:id), will go to transaksiController.delete
router.delete(
  "/",
  auth.photographer,
  userValidator.delete,
  userController.delete
);

module.exports = router; // Export router
