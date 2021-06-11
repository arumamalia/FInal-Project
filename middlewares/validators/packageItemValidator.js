const crypto = require("crypto");
const path = require("path");
const validator = require("validator");
const { packager, packageItem } = require("../../models");

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
    if (!req.body.itemName && !req.body.price) {
      next();
    }
    req.body.itemName = [req.body.itemName].flat(Infinity);
    req.body.price = [req.body.price].flat(Infinity);

    for (let i = 0; i < req.body.itemName.length; i++) {
      // Initialita
      let errors = [];
      // let findData = await packager.findOne({
      //   where: { id: req.body.packageId },
      // });

      // if (!findData) {
      //   errors.push("Package not found");
      //   return errorHandler(errors, req, res, next);
      // }
      if (!req.body.itemName[i]) {
        errors.push("item name must be fill");
        return errorHandler(errors, req, res, next);
      }
      if (!req.body.price[i]) {
        errors.push("price must be fill");
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

exports.update = async (req, res, next) => {
  try {
    // Initialita
    if (!req.body.itemName && !req.body.price) {
      return next();
    }
    let dataPackage = await packageItem.findAll({
      where: { id_package: req.body.packageId },
    });
    dataPackage = [dataPackage].flat(Infinity);
    req.body.itemName = [req.body.itemName].flat(Infinity);
    req.body.price = [req.body.price].flat(Infinity);
    // console.log(dataPackage.length);

    let errors = [];

    // if (!req.body.itemName && !req.body.price) {
    //   next();
    // }
    // req.body.itemName = [req.body.itemName].flat(Infinity);
    // req.body.price = [req.body.price].flat(Infinity);

    for (let i = 0; i < req.body.itemName.length; i++) {
      // Initialita
      console.log(req.body.itemName[i]);
      if (!req.body.itemName[i]) {
        errors.push("item name must be fill");
        return errorHandler(errors, req, res, next);
      }
      if (!req.body.price[i]) {
        errors.push("price must be fill");
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
