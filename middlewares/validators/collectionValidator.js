const crypto = require("crypto");
const path = require("path");
const { collection, collectionImages, user } = require("../../models");
const validator = require("validator");
const errorHandler = (err, req, res, next) => {
  if (err.length > 0) {
    return res.status(400).json({
      message: err.join(", "),
      success: false,
      code: 400,
    });
  }
};

module.exports.create = async (req, res, next) => {
  try {
    let errors = [];
    let findData = await user.findOne({
      where: { id: req.user.id },
    });

    if (!findData) {
      errors.push("User not found");
      return errorHandler(errors, req, res, next);
    }

    if (!req.body.title) {
      errors.push("Title must be fill");
      return errorHandler(errors, req, res, next);
    }

    if (!validator.isDate(req.body.date)) {
      errors.push("Date is consist of yyyy/mm/dd");
      return errorHandler(errors, req, res, next);
    }

    if (!req.files) {
      errors.push("Cover must be fill");
      return errorHandler(errors, req, res, next);
    }
    // If image was uploaded

    if (req.files) {
      const file = req.files.image;

      // Make sure image is photo
      if (!file.mimetype.startsWith("image")) {
        errors.push("File must be an image");
        return errorHandler(errors, req, res, next);
      }

      // Check file size (max 1MB)
      if (file.size > 10000000) {
        errors.push("Image must be less than 10MB");
        return errorHandler(errors, req, res, next);
      }

      // Create custom filename
      let fileName = crypto.randomBytes(16).toString("hex");

      // Rename the file
      file.name = `${fileName}${path.parse(file.name).ext}`;

      // assign req.body.image with file.name
      req.body.cover = file.name;

      // Upload image to /public/images
      file.mv(`./public/images/${file.name}`, async (err) => {
        if (err) {
          console.error(err);
          return next(err);
        }
      });
    }

    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
      success: false,
      code: 500,
    });
  }
};

module.exports.update = async (req, res, next) => {
  try {
    let errors = [];

    let findData = await user.findOne({
      where: { id: req.user.id },
    });

    let findDataCollection = await collection.findOne({
      where: { id: req.query.id_collection },
    });

    if (!findData) {
      errors.push("User not found");
      return errorHandler(errors, req, res, next);
    }

    if (!findDataCollection) {
      errors.push("Collection Not Found");
      return errorHandler(errors, req, res, next);
    }

    if (!req.body.title) {
      errors.push("Title must be fill");
      return errorHandler(errors, req, res, next);
    }

    if (!validator.isDate(req.body.date)) {
      errors.push("Date is consist of yyyy/mm/dd");
      return errorHandler(errors, req, res, next);
    }

    // if (!req.files) {
    //   errors.push("Cover must be fill");
    //   return errorHandler(errors, req, res, next);
    // }
    // If image was uploaded

    if (req.files) {
      const file = req.files.image;

      // Make sure image is photo
      if (!file.mimetype.startsWith("image")) {
        errors.push("File must be an image");
        return errorHandler(errors, req, res, next);
      }

      // Check file size (max 1MB)
      if (file.size > 10000000) {
        errors.push("Image must be less than 10MB");
        return errorHandler(errors, req, res, next);
      }

      // Create custom filename
      let fileName = crypto.randomBytes(16).toString("hex");

      // Rename the file
      file.name = `${fileName}${path.parse(file.name).ext}`;

      // assign req.body.image with file.name
      req.body.cover = file.name;

      // Upload image to /public/images
      file.mv(`./public/images/${file.name}`, async (err) => {
        if (err) {
          console.error(err);
          return next(err);
        }
      });
    }

    next();
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
      success: false,
      code: 500,
    });
  }
};

exports.filter = async (req, res, next) => {
  try {
    let errors = [];
    let findData = await collection.findAll({
      where: { isCompleted: req.query.isCompleted },
    });

    if (!findData) {
      errors.push("Collection Not Found");
      return errorHandler(errors, req, res, next);
    }

    next();
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
    });
  }
};
