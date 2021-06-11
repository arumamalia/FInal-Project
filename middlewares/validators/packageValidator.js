const crypto = require("crypto");
const path = require("path");
const validator = require("validator");
const { packager, packageItem } = require("../../models");

const errorHandler = (err, req, res, next) => {
  packageItem.destroy({ where: { id_package: null } });
  if (err.length > 0) {
    return next({ message: err.join(", "), statusCode: 400 });
  }
};
exports.create = async (req, res, next) => {
  try {
    // Initialita

    let errors = [];

    if (!req.body.name) {
      errors.push("Name must be fill");
      return errorHandler(errors, req, res, next);
    }
    if (!req.body.description) {
      errors.push("Description must be fill");
      return errorHandler(errors, req, res, next);
    }
    // if (!req.files) {
    //   errors.push("Image must be fill");
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
      if (file.size > 1000000) {
        errors.push("Image must be less than 1MB");
        return errorHandler(errors, req, res, next);
      }

      // Create custom filename
      let fileName = crypto.randomBytes(16).toString("hex");

      // Rename the file
      file.name = `${fileName}${path.parse(file.name).ext}`;

      // assign req.body.image with file.name
      req.body.image = file.name;

      // Upload image to /public/images
      file.mv(`./public/images/${file.name}`, async (err) => {
        if (err) {
          console.error(err);
          return next(err);
        }
      });
    }

    // It means that will be go to the next middleware
    next();
  } catch (e) {
    return next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    // Initialita
    let errors = [];

    let find = await packager.findOne({ where: { id: req.body.packageId } });

    if (!find) {
      errors.push("Package not found");
    }
    // If image was uploaded
    if (!req.body.name) {
      errors.push("Name must be fill");
      return errorHandler(errors, req, res, next);
    }
    if (!req.body.description) {
      errors.push("Description must be fill");
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
      if (file.size > 1000000) {
        errors.push("Image must be less than 1MB");
        return errorHandler(errors, req, res, next);
      }

      // Create custom filename
      let fileName = crypto.randomBytes(16).toString("hex");

      // Rename the file
      file.name = `${fileName}${path.parse(file.name).ext}`;

      // assign req.body.image with file.name
      req.body.image = file.name;

      // Upload image to /public/images
      file.mv(`./public/images/${file.name}`, async (err) => {
        if (err) {
          return next(err);
        }
      });
    }

    if (errors.length > 0) {
      return next({ message: errors.join(", "), statusCode: 400 });
    }
    // It means that will be go to the next middleware
    next();
  } catch (e) {
    // console.log(e);
    return next(e);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    let find = await packager.findOne({ where: { id: req.query.packageId } });

    if (!find) {
      return next({ message: "Package not found", statusCode: 404 });
    }
    // It means that will be go to the next middleware
    next();
  } catch (e) {
    return next(e);
  }
};
