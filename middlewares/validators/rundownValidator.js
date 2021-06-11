const { user, project, rundown } = require("../../models"); // Import all models
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
    let findData = await project.findOne({
      where: {
        id: req.body.id_project,
      },
    });

    if (!findData) {
      errors.push("Project Not Found");
      return errorHandler(errors, req, res, next);
    }

    if (!req.body.person) {
      errors.push("person name must be fill");
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
    let findData = await rundown.findOne({
      where: {
        id: req.query.id,
      },
    });

    if (!findData) {
      errors.push("Rundown Not Found");
      return errorHandler(errors, req, res, next);
    }
    let findData2 = await project.findOne({
      where: {
        id: req.body.id_project,
      },
    });

    if (!findData2) {
      errors.push("Project Not Found");
      return errorHandler(errors, req, res, next);
    }
    if (!req.body.person) {
      errors.push("person name must be fill");
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
    let findData = await rundown.findOne({
      where: {
        id: req.query.id,
      },
    });

    // if (!findData) {
    //   errors.push("Rundown Not Found");
    //   return errorHandler(errors, req, res, next);
    // }

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

    let findData = await rundown.findOne({
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
    return res.status(500).json({
      message: "Internal Server Error in Validator",
      error: e,
    });
  }
};
