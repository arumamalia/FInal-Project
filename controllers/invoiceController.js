const { invoice, project, detailInvoice, user } = require("../models");
const sequelize = require("sequelize");
const uploadImage = require("../middlewares/uploads/imageUpload");
const Op = sequelize.Op;

class InvoiceController {
  async getAll(req, res) {
    try {
      let data = await invoice.findAll({
        where: { id_project: req.query.id_project },
        attributes: [
          ["id", "id_invoice"],
          "issuedDate",
          "dueDate",
          "isPaid",
          "paidCost",
          "subtotal",
          "amountDue",
          "invoiceName",
          "billToName",
          "billToAddress",
          // "paymentDate",
          "receipt",
        ],
        include: [
          {
            model: project,
            attributes: [
              ["id", "id_project"],
              // ["clientName", "billToName"],
              // ["clientAddress", "billToAddress"],
            ],
            include: [
              {
                model: user,
                attributes: [
                  ["id", "id_user"],
                  "photo",
                  "businessName",
                  "email",
                  ["name", "billFromName"],
                  ["address", "billFromAddress"],
                ],
              },
            ],
          },
          {
            model: detailInvoice,
            attributes: [
              ["id", "id_detailInvoice"],
              "name",
              "quantity",
              "price",
              "amount",
            ],
          },
        ],
      });

      return res.status(200).json({
        message: "Get all invoice",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
        Success: false,
        code: 500,
      });
    }
  }

  async getOne(req, res) {
    try {
      let finddata = await invoice.findOne({
        where: { id: req.query.id_invoice },
      });
      if (!finddata) {
        return res.status(400).json({
          message: "invoice not found",
          code: 400,
        });
      }
      let issuedDate = await new Date(finddata.issuedDate);
      let dueDate = await new Date(finddata.dueDate);
      let msPerDay = 24 * 60 * 60 * 1000;
      let daysleft = (dueDate.getTime() - issuedDate.getTime()) / msPerDay;
      let data = await invoice.findOne({
        where: { id: req.query.id_invoice },
        /*{*/
        attributes: [
          ["id", "id_invoice"],
          "id_project",
          "issuedDate",
          "dueDate",
          "isPaid",
          "paidCost",
          "subtotal",
          "amountDue",
          "invoiceName",
          "billToName",
          "billToAddress",
          // "paymentDate",
          "receipt",
          [sequelize.literal(daysleft), "total"],
          [sequelize.col("invoice.updatedAt"), "paymentDate"],
        ],
        include: [
          {
            model: project,
            attributes: [
              ["id", "id_project"],
              // ["clientName", "billToName"],
              // ["clientAddress", "billToAddress"],
            ],
            include: [
              {
                model: user,
                attributes: [
                  ["id", "id_user"],
                  "photo",
                  "businessName",
                  "email",
                  ["name", "billFromName"],
                  ["address", "billFromAddress"],
                ],
              },
            ],
          },
          {
            model: detailInvoice,
            attributes: [
              ["id", "id_detailInvoice"],
              "name",
              "quantity",
              "price",
              "amount",
            ],
          },
        ],
      });

      // if (!data) {
      //   return res.status(400).json({
      //     message: "invoice not found",
      //     Success: false,
      //     code: 400,
      //   });
      // }
      if (data == null) {
        data = [];
      }

      return res.status(200).json({
        message: "Success",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
        Success: false,
        code: 500,
      });
    }
  }

  async create(req, res) {
    try {
      // create invoice name
      let nameSort = "";
      let business = await project.findOne({
        where: { id: req.query.id_project },
        include: [{ model: user, attributes: ["businessName"] }],
      });

      let nameForInvoice = business.user.businessName.split(" ");
      for (let i = 0; i < nameForInvoice.length; i++) {
        nameSort = nameSort + nameForInvoice[i][0].toUpperCase();
      }

      let count = await invoice.findAll({
        where: { id_project: req.query.id_project },
      });

      let invoiceName = count.length;
      // .then((sum) => sum);
      console.log(invoiceName);
      invoiceName = invoiceName + 1;
      invoiceName = invoiceName + "";
      let arrIn = invoiceName.split("");
      while (arrIn.length < 4) {
        arrIn.unshift("0");
      }
      invoiceName = `#${nameSort}-${arrIn.join("")}`;

      //create default bill to name & bill to address
      let dataProject = await project.findOne({
        where: { id: req.query.id_project },
      });
      // create receipt
      let image;
      // console.log(req.files);
      if (req.files) {
        image = await uploadImage.uplaodOneImage(req.files, `receipt`);
      } else {
        image = null;
      }
      console.log(image);
      //create Data
      let createData = await invoice.create({
        issuedDate: req.body.issuedDate,
        dueDate: req.body.dueDate,
        isPaid: req.body.isPaid || false,
        paidCost: req.body.paidCost || 0,
        id_project: req.query.id_project,
        invoiceName: invoiceName,
        receipt: image,
        billToName: req.body.billToName || dataProject.clientName,
        billToAddress: req.body.billToAddress || dataProject.clientAddress,
      });

      await detailInvoice.update(
        { id_invoice: createData.id },
        { where: { id_invoice: null } }
      );

      let subtotal = await detailInvoice
        .sum("amount", { where: { id_invoice: createData.id } })
        .then((sum) => sum);
      let paidCost = await invoice.findOne({
        where: { id: createData.id },
        attributes: ["paidCost"],
      });

      let amountDoucost = subtotal - paidCost.paidCost;
      let updateIsPaid;
      if (amountDoucost == 0) {
        updateIsPaid = {
          amountDue: amountDoucost,
          subtotal: subtotal,
          isPaid: true,
        };
        await invoice.update(updateIsPaid, {
          where: { id: createData.id },
          attributes: [[sequelize.literal("updatedAt"), "paymentDate"]],
        });
      } else {
        updateIsPaid = { amountDue: amountDoucost, subtotal: subtotal };
        await invoice.update(updateIsPaid, { where: { id: createData.id } });
      }

      let data = await invoice.findOne({
        where: { id: createData.id },
      });
      return res.status(200).json({
        message: "Success",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
        Success: false,
        code: 500,
      });
    }
  }

  async update(req, res) {
    try {
      let dataProject = await project.findOne({
        where: { id: req.query.id_project },
      });

      // if (!req.files) {
      //   return res.status(400).json({
      //     message: "must be fill receipt",
      //     code: 400,
      //   });
      // }
      let update;
      if (req.files) {
        let receipt = await uploadImage.uplaodOneImage(req.files, `receipt`);
        update = {
          issuedDate: req.body.issuedDate,
          dueDate: req.body.dueDate,
          paidCost: req.body.paidCost,
          isPaid: req.body.isPaid,
          id_project: req.query.id_project,
          receipt: receipt,
          billToName: req.body.billToName || dataProject.clientName,
          billToAddress: req.body.billToAddress || dataProject.clientAddress,
        };
      } else {
        update = {
          issuedDate: req.body.issuedDate,
          dueDate: req.body.dueDate,
          paidCost: req.body.paidCost,
          isPaid: req.body.isPaid,
          id_project: req.query.id_project,
          billToName: req.body.billToName || dataProject.clientName,
          billToAddress: req.body.billToAddress || dataProject.clientAddress,
        };
      }
      await invoice.update(update, {
        where: { id: req.query.id_invoice },
        // attributes: [[sequelize.literal("updatedAt"), "paymentDate"]],
      });

      let subtotal = await detailInvoice
        .sum("amount", { where: { id_invoice: req.query.id_invoice } })
        .then((sum) => sum);
      let paidCost = await invoice.findOne({
        where: { id: req.query.id_invoice },
        attributes: ["paidCost"],
      });

      let amountDoucost = subtotal - paidCost.paidCost;
      let updateIsPaid;
      if (amountDoucost == 0) {
        updateIsPaid = {
          amountDue: amountDoucost,
          subtotal: subtotal,
          isPaid: true,
        };
        await invoice.update(updateIsPaid, {
          where: { id: req.query.id_invoice },
          attributes: [[sequelize.literal("updatedAt"), "paymentDate"]],
        });
      } else {
        updateIsPaid = { amountDue: amountDoucost, subtotal: subtotal };
        await invoice.update(updateIsPaid, {
          where: { id: req.query.id_invoice },
        });
      }
      let data = await invoice.findOne({
        where: { id: req.query.id_invoice },
        attributes: [
          "receipt",
          ["id", "id_invoice"],
          "id_project",
          "issuedDate",
          "dueDate",
          "isPaid",
          "paidCost",
          "subtotal",
          "amountDue",
          "invoiceName",
          "billToName",
          "billToAddress",
          // "paymentDate",

          // [sequelize.literal(daysleft), "total"],
          [sequelize.col("invoice.updatedAt"), "paymentDate"],
        ],
        include: [
          {
            model: project,
            attributes: [
              ["id", "id_project"],
              // ["clientName", "billToName"],
              // ["clientAddress", "billToAddress"],
            ],
            include: [
              {
                model: user,
                attributes: [
                  ["id", "id_user"],
                  "photo",
                  "businessName",
                  "email",
                  ["name", "billFromName"],
                  ["address", "billFromAddress"],
                ],
              },
            ],
          },
          {
            model: detailInvoice,
            attributes: [
              ["id", "id_detailInvoice"],
              "name",
              "quantity",
              "price",
              "amount",
            ],
          },
        ],
      });
      return res.status(200).json({
        message: "update detail invoice",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
        Success: false,
        code: 500,
      });
    }
  }

  // async updateReceipt

  async delete(req, res) {
    try {
      // Delete data
      let data = await invoice.destroy({
        where: { id: req.query.id_invoice },
      });

      // If data deleted is null
      if (!data) {
        return res.status(404).json({
          message: "invoice not found",
          Success: false,
          code: 404,
        });
      }

      // If success
      return res.status(200).json({
        message: "Success delete invoice",
        Success: true,
        code: 200,
      });
    } catch (e) {
      // If error
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
        Success: false,
        code: 500,
      });
    }
  }
}

module.exports = new InvoiceController();
