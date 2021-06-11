const express = require("express");
const passport = require("passport");


const router = express.Router();

// import for auth needs
const auth = require("../middlewares/auth")
const authValidator = require("../middlewares/validators/authValidator");

const authController = require("../controllers/authController");
// const userValidator = require("../middlewares/validators/userValidator");
// const userUpload = require("../middlewares/uploads/userUpload");

router.post("/signup", authValidator.signup, auth.signup, authController.getToken);
router.post("/signin", authValidator.signin, auth.signin, authController.getToken);


module.exports = router;