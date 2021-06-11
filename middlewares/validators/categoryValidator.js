const crypto = require("crypto");
const path = require("path");
const validator = require("validator");
const { category, packageItem } = require("../../models");

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
    // Initialita
    let errors = [];
    // let findData = await packageItem.findOne({
    //   where: { id: req.body.packageItemId },
    // });

    // if (!findData) {
    //   errors.push("Package item not found");
    //   return errorHandler(errors, req, res, next);
    // }
    if (!req.body.name) {
      errors.push("category must be fill");
      return errorHandler(errors, req, res, next);
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

exports.update = async (req, res, next) => {
  try {
    // Initialita
    let errors = [];

    let findCategory = await category.findOne({
      where: { id: req.body.categoryId },
    });
    // let findData = await packageItem.findOne({
    //   where: { id: req.body.packageItemId },
    // });

    if (!findCategory) {
      errors.push("Category not found");
      return errorHandler(errors, req, res, next);
    }
    // if (!findData) {
    //   errors.push("Package item not found");
    //   return errorHandler(errors, req, res, next);
    // }
    if (!req.body.name) {
      errors.push("category must be fill");
      return errorHandler(errors, req, res, next);
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
