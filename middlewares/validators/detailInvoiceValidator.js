const crypto = require("crypto");
const path = require("path");
const validator = require("validator");
const { detailInvoice, invoice, project } = require("../../models");

const errorHandler = (err, req, res, next) => {
  if (err.length > 0) {
    return res.status(400).json({
      message: err.join(", "),
      success: false,
      code: 400,
    });
  }
};

exports.create = async (req, res, next) => {
  try {
    if (!req.body.name && !req.body.price) {
      next();
    }
    req.body.name = [req.body.name].flat().flat();
    req.body.price = [req.body.price].flat().flat();
    req.body.quantity = [req.body.quantity].flat().flat();
    let errors = [];

    for (let i = 0; i < req.body.name.length; i++) {
      if (!req.body.name[i]) {
        errors.push("name must be fill");
        return errorHandler(errors, req, res, next);
      }
      if (!req.body.quantity[i]) {
        errors.push("quantity must be fill");
        return errorHandler(errors, req, res, next);
      }
      if (!req.body.price[i]) {
        errors.push("price must be fill");
        return errorHandler(errors, req, res, next);
      }
      if (!validator.isInt(req.body.quantity[i])) {
        errors.push("Quantity must be integer");
        return errorHandler(errors, req, res, next);
      }
      if (!validator.isInt(req.body.price[i])) {
        errors.push("price must be integer");
        return errorHandler(errors, req, res, next);
      }
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false,
      code: 500,
    });
  }
};

exports.update = async (req, res, next) => {
  try {
    // Initialita
    let errors = [];
    if (!req.body.name && !req.body.price) {
      next();
    }
    req.body.name = [req.body.name].flat().flat();
    req.body.price = [req.body.price].flat().flat();
    req.body.quantity = [req.body.quantity].flat().flat();

    for (let i = 0; i < req.body.name.length; i++) {
      if (!req.body.name[i]) {
        errors.push("name must be fill");
        return errorHandler(errors, req, res, next);
      }
      if (!req.body.quantity[i]) {
        errors.push("quantity must be fill");
        return errorHandler(errors, req, res, next);
      }
      if (!req.body.price[i]) {
        errors.push("price must be fill");
        return errorHandler(errors, req, res, next);
      }
      if (!validator.isInt(req.body.quantity[i])) {
        errors.push("Quantity must be integer");
        return errorHandler(errors, req, res, next);
      }
      if (!validator.isInt(req.body.price[i])) {
        errors.push("price must be integer");
        return errorHandler(errors, req, res, next);
      }
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false,
      code: 500,
    });
  }
};
