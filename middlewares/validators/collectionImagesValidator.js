const crypto = require("crypto");
const path = require("path");
const { collection, collectionImages } = require("../../models");
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

    let file;
    if (req.files.image.length > 1) {
      file = req.files.image;
    } else {
      file = [req.files.image];
    }

    let findCollection = await collection.findOne({
      where: { id: req.body.id_collection },
    });

    // if (!findCollection) {
    //   return res.status(400).json({
    //     message: "collection not found",
    //     success: false,
    //     code: 400,
    //   });
    // }

    if (req.files) {
      for (let i = 0; i < file.length; i++) {
        if (!file[i].mimetype.startsWith("image")) {
          errors.push("File must be an image");
          return errorHandler(errors, req, res, next);
        }

        // Check file size (max 1MB)
        if (file[i].size > 10000000) {
          errors.push("Image must be less than 10MB");
          return errorHandler(errors, req, res, next);
        }
      }
    }
    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      error: e,
      Success: false,
      code: 500,
    });
  }
};

module.exports.update = async (req, res, next) => {
  try {
    let findData = await Promise.all([
      collectionImages.findOne({
        where: { id: req.params.id },
      }),
    ]);

    let errors = [];

    if (!findData) {
      errors.push("Collection Not Found");
      return errorHandler(errors, req, res, next);
    }

    console.log(req.files);
    if (req.files) {
      const file = req.files.image;

      if (!file.mimetype.startsWith("image")) {
        errors.push("File must be an image");
        return errorHandler(errors, req, res, next);
      }

      if (file.size > 1000000) {
        errors.push("Image must be less than 1MB");
        return errorHandler(errors, req, res, next);
      }

      let fileName = crypto.randomBytes(16).toString("hex");

      file.name = `${fileName}${path.parse(file.name).ext}`;

      req.body.image = file.name;

      file.mv(`./public/images/${file.name}`, async (err) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
          });
        }
      });
    }

    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      error: e,
      Success: false,
      code: 500,
    });
  }
};
