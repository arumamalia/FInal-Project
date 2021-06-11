const { user, project, rundown, event } = require("../../models"); // Import all models
const validator = require("validator"); // Import validator

const errorHandler = (err, req, res, next) => {
  if (err.length > 0) {
    return res.status(400).json({
      message: err.join(", "),
    });
  }
};
function validateTime(time) {
  const timeReg = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  if (time.match(timeReg)) {
    return true;
  } else return false;
}
exports.create = async (req, res, next) => {
  try {
    let errors = [];

    let findData = await rundown.findOne({
      where: {
        id: req.body.id_rundown,
      },
    });

    if (!findData) {
      errors.push("Rundown Not Found");
      return errorHandler(errors, req, res, next);
    }
    if (!req.body.name) {
      errors.push("name must be fill");
      return errorHandler(errors, req, res, next);
    }
    if (!req.body.from || !req.body.to) {
      errors.push("from and to must be fill");
      return errorHandler(errors, req, res, next);
    }

    if (validateTime(req.body.from) == false) {
      errors.push("from: invalid time format (HH:MM)");
      return errorHandler(errors, req, res, next);
    }

    if (validateTime(req.body.to) == false) {
      errors.push("to: invalid time format (HH:MM)");
      return errorHandler(errors, req, res, next);
    }

    if (!req.body.description) {
      errors.push("description must be fill");
      return errorHandler(errors, req, res, next);
    }

    if (!req.body.theme) {
      errors.push("theme must be fill");
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
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
    let findData = await event.findOne({
      where: {
        id: req.query.id,
      },
    });

    if (!findData) {
      errors.push("Event Not Found");
      return errorHandler(errors, req, res, next);
    }
    if (!req.body.name) {
      errors.push("name must be fill");
      return errorHandler(errors, req, res, next);
    }

    if (!req.body.from || !req.body.to) {
      errors.push("from and to must be fill");
      return errorHandler(errors, req, res, next);
    }

    if (validateTime(req.body.from) == false) {
      errors.push("from: invalid time format (HH:MM)");
      return errorHandler(errors, req, res, next);
    }

    if (validateTime(req.body.to) == false) {
      errors.push("to: invalid time format (HH:MM)");
      return errorHandler(errors, req, res, next);
    }

    if (!req.body.description) {
      errors.push("description must be fill");
      return errorHandler(errors, req, res, next);
    }

    if (!req.body.theme) {
      errors.push("theme must be fill");
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
    let findData = await event.findAll({ where: { id_rundown: req.query.id } });
    console.log(findData);
    if (findData.length == 0) {
      errors.push("Event Not Found");
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
    let findData = await event.findOne({
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
