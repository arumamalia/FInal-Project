const { user, project } = require("../../models"); // Import all models
const validator = require("validator"); // Import validator

const errorHandler = (err, req, res, next) => {
  if (err.length > 0) {
    return res.status(400).json({
      message: err.join(", "),
    });
  }
};

exports.create = async (req, res, next) => {
  try {
    let errors = [];

    if (!req.body.title) {
      errors.push("title name must be fill");
      return errorHandler(errors, req, res, next);
    }

    if (!validator.isDate(req.body.date)) {
      errors.push("invalid date format (YYYY/MM/DD)");
      return errorHandler(errors, req, res, next);
    }

    if (!req.body.clientName) {
      errors.push("client name must be fill");
      return errorHandler(errors, req, res, next);
    }
    if (!req.body.clientAddress) {
      errors.push("client address must be fill");
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

exports.update = async (req, res, next) => {
  try {
    let errors = [];
    let findData = await project.findOne({
      where: {
        id_user: req.user.id,
        id: req.query.id,
      },
    });

    if (!findData) {
      errors.push("Project Not Found");
      return errorHandler(errors, req, res, next);
    }

    if (!req.body.title) {
      errors.push("title name must be fill");
      return errorHandler(errors, req, res, next);
    }

    if (!validator.isDate(req.body.date)) {
      errors.push("invalid date format (YYYY/MM/DD)");
      return errorHandler(errors, req, res, next);
    }

    if (!req.body.clientName) {
      errors.push("client name must be fill");
      return errorHandler(errors, req, res, next);
    }
    if (!req.body.clientAddress) {
      errors.push("client address must be fill");
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

exports.getOne = async (req, res, next) => {
  try {
    let errors = [];
    let findData = await project.findOne({
      where: {
        id_user: req.user.id,
        id: req.query.id,
      },
    });

    if (!findData) {
      errors.push("Project Not Found");
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

exports.delete = async (req, res, next) => {
  try {
    let errors = [];
    // Validate Parameter
    let findData = await project.findOne({
      where: {
        id_user: req.user.id,
        id: req.query.id,
      },
    });

    if (!findData) {
      errors.push("Data Not Found");
      return errorHandler(errors, req, res, next);
    }

    next();
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error in Validator",
      error: e,
    });
  }
};
