const validator = require("validator");
const { user } = require("../../models");

exports.signup = async (req, res, next) => {
  try {
    let errors = [];

    let data = await user.findAll({});

    console.log(data.length);
    for (let i = 0; i < data.length; i++) {
      if (data[i].email == req.body.email) {
        errors.push("email already exist");
      }
    }

    // Check email
    if (!validator.isEmail(req.body.email)) {
      errors.push("Email field must be valid email");
    }

    // Check password strength
    if (!validator.isStrongPassword(req.body.password)) {
      errors.push(
        "Password needs (uppercase & lowercase characters, number, and symbol)"
      );
    }

    // Check password confirmation
    if (req.body.confirmPassword !== req.body.password) {
      errors.push("Password confirmation must be same as password");
    }

    // If errors
    if (errors.length > 0) {
      return next({ message: errors.join(", "), statusCode: 400 });
    }

    next();
  } catch (e) {
    return next(e);
  }
};

exports.signin = async (req, res, next) => {
  try {
    let errors = [];

    // Check email
    if (!validator.isEmail(req.body.email)) {
      errors.push("Email field must be valid email");
    }

    // Check password strength
    if (!validator.isStrongPassword(req.body.password)) {
      errors.push(
        "Password needs (uppercase & lowercase characters, number, and symbol)"
      );
    }

    // If errors
    if (errors.length > 0) {
      return next({ message: errors.join(", "), statusCode: 400 });
    }

    next();
  } catch (e) {
    return next(e);
  }
};
