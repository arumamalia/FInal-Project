const crypto = require("crypto");
const path = require("path");
const validator = require("validator");
const { invoice, project, detailInvoice } = require("../../models");

const errorHandler = (err, req, res, next) => {
  detailInvoice.destroy({ where: { id_invoice: null } });
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
    let issuedDate = await new Date(req.body.issuedDate);
    let dueDate = await new Date(req.body.dueDate);
    let msPerDay = 24 * 60 * 60 * 1000;
    let daysleft = (dueDate.getTime() - issuedDate.getTime()) / msPerDay;
    req.body.isPaid = req.body.isPaid || "false";
    let errors = [];
    let findData = await project.findOne({
      where: { id: req.query.id_project },
    });

    if (!findData) {
      errors.push("Project not found");
      return errorHandler(errors, req, res, next);
    }
    if (!validator.isDate(req.body.issuedDate)) {
      errors.push("invalid issuedDate format (YYYY/MM/DD)");
      return errorHandler(errors, req, res, next);
    }
    if (!validator.isDate(req.body.dueDate)) {
      errors.push("invalid dueDate format (YYYY/MM/DD)");
      return errorHandler(errors, req, res, next);
    }
    // if (!req.body.isPaid) {
    //   errors.push("Paid status must be fill");
    //   return errorHandler(errors, req, res, next);
    // }
    // if (!req.body.paidCost) {
    //   errors.push("Paid cost must be fill");
    //   return errorHandler(errors, req, res, next);
    // }
    if (!validator.isBoolean(req.body.isPaid)) {
      errors.push("Paid status must be boolean");
      return errorHandler(errors, req, res, next);
    }
    if (daysleft < 0) {
      errors.push("Due date must be over issued date");
      return errorHandler(errors, req, res, next);
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
    let findData = await project.findOne({
      where: { id: req.query.id_project },
    });

    let findDataInvoice = await invoice.findOne({
      where: { id: req.query.id_invoice },
    });

    if (!findDataInvoice) {
      errors.push("invoice item not found");
      return errorHandler(errors, req, res, next);
    }
    if (!findData) {
      errors.push("Project item not found");
      return errorHandler(errors, req, res, next);
    }
    if (!validator.isDate(req.body.issuedDate)) {
      errors.push("invalid issuedDate format (YYYY/MM/DD)");
      return errorHandler(errors, req, res, next);
    }
    if (!validator.isDate(req.body.dueDate)) {
      errors.push("invalid dueDate format (YYYY/MM/DD)");
      return errorHandler(errors, req, res, next);
    }
    if (!req.body.isPaid) {
      errors.push("Paid status must be fill");
      return errorHandler(errors, req, res, next);
    }
    if (!req.body.paidCost) {
      errors.push("Paid cost must be fill");
      return errorHandler(errors, req, res, next);
    }
    if (!validator.isBoolean(req.body.isPaid)) {
      errors.push("Paid status must be boolean");
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
