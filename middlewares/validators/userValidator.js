const crypto = require("crypto");
const path = require("path");
const validator = require("validator"); // Import validator
const bcrypt = require("bcrypt");
const { user, project } = require("../../models");

const errorHandler = (err, req, res, next) => {
  // if (err.length > 0) {
  return next({ message: err.join(", "), statusCode: 400 });
  // }
};
// exports.getall = async (req, res, next) => {
//   try {
//     let errors = [];
//     let findData = await user.findall({});

//     if (!findData) {
//       errors.push("user Not Found");
//       return errorHandler(errors, req, res, next);
//     }

//     next();
//   } catch (e) {
//     return next(e);
//   }
// };

// exports.getOne = async (req, res, next) => {
//   try {
//     let errors = [];
//     let findData = await user.findOne({
//       where: {
//         id: req.user.id,
//       },
//     });

//     if (!findData) {
//       errors.push("user Not Found");
//       return errorHandler(errors, req, res, next);
//     }

//     next();
//   } catch (e) {
//     return next(e);
//   }
// };

exports.update = async (req, res, next) => {
  try {
    let errors = [];
    // console.log(req.files);
    if (req.files) {
      const file = req.files.photo;

      if (!file.mimetype.startsWith("image")) {
        errors.push("File must be an image");
        return errorHandler(errors, req, res, next);
      }

      if (file.size > 1000000) {
        errors.push("Image must be less than 1MB");
        return errorHandler(errors, req, res, next);
      }

      // Create custom filename
      let fileName = crypto.randomBytes(16).toString("hex");

      // Rename the file
      file.name = `${fileName}${path.parse(file.name).ext}`;

      // assign req.body.image with file.name
      req.body.photo = file.name;

      // Upload image to /public/images
      file.mv(`./public/images/${file.name}`, async (err) => {
        if (err) {
          console.error(err);

          return next(e);
        }
      });
    }

    let findData = await user.findOne({
      where: {
        id: req.user.id,
      },
    });

    if (!findData) {
      errors.push("User Not Found");
      return errorHandler(errors, req, res, next);
    }

    if (!req.body.name) {
      errors.push("name must be fill");
      return errorHandler(errors, req, res, next);
    }

    if (!req.body.businessName) {
      errors.push("businessName must be fill");
      return errorHandler(errors, req, res, next);
    }

    if (!req.body.address) {
      errors.push("address must be fill");
      return errorHandler(errors, req, res, next);
    }

    next();
  } catch (e) {
    return next(e);
  }
};

exports.delete = async (req, res, next) => {
  let errors = [];
  try {
    // Validate Parameter
    let findData = await user.findOne({
      where: {
        id: req.query.id,
      },
    });

    if (!findData) {
      errors.push("Data Not Found");
      return errorHandler(errors, req, res, next);
    }

    next();
  } catch (e) {
    console.log(e);
    return next(e);
  }
};
