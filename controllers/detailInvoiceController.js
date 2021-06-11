const {
  detailInvoice,
  invoice,
  packager,
  packageItem,
  project,
} = require("../models");

class DetailInvoiceController {
  async getAll(req, res) {
    try {
      let data = await detailInvoice.findAll({});
      return res.status(200).json({
        message: "Get all detailInvoice",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  }

  async getOne(req, res) {
    try {
      let data = await detailInvoice.findOne({
        where: { id: req.query.id_detailInvoice },
      });

      if (!data) {
        return res.status(400).json({
          message: "detail invoice not found",
          success: false,
          code: 400,
        });
      }

      return res.status(200).json({
        message: "get one detail invoice",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  }

  async create(req, res) {
    try {
      let data = [];
      for (let i = 0; i < req.body.name.length; i++) {
        let createData = await detailInvoice.create({
          name: req.body.name[i],
          quantity: req.body.quantity[i],
          price: req.body.price[i],
          amount: req.body.price[i] * req.body.quantity[i],
          id_invoice: req.query.id_invoice || null,
        });
        data.push(
          await detailInvoice.findOne({
            where: { id: createData.id },
          })
        );
      }

      return res.status(200).json({
        message: "create detail invoice",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  }

  async addPackage(req, res, next) {
    try {
      let data = [];

      // let findInovice = await invoice.findOne({
      //   where: { id: req.query.id_invoice },
      // });

      // if (!findInovice) {
      //   return res.status(404).json({
      //     message: "Invoice not found",
      //     success: false,
      //     code: 404,
      //   });
      // }
      // let id_project = await findInovice.id_project;
      let findProject = await project.findOne({
        where: { id: req.query.id_project },
      });
      if (!findProject) {
        return next({ message: "project not found", statusCode: 404 });
      }
      let findPackageItem = await packageItem.findAll({
        where: { id_package: findProject.id_package },
      });

      if (!findPackageItem) {
        return next({
          message: "project doesn't have package yet",
          statusCode: 404,
        });
      }

      console.log(findPackageItem);
      // console.log(findProject.id_package);
      // console.log(findPackageItem);
      for (let i = 0; i < findPackageItem.length; i++) {
        let createData = await detailInvoice.create({
          name: findPackageItem[i].itemName,
          quantity: 1,
          price: findPackageItem[i].price,
          amount: 1 * findPackageItem[i].price,
          id_invoice: req.query.id_invoice,
        });

        data.push(
          await detailInvoice.findOne({
            where: { id: createData.id },
          })
        );
      }
      // let subtotal = await detailInvoice
      //   .sum("amount", { where: { id_invoice: req.query.id_invoice } })
      //   .then((sum) => sum);
      // let paidCost = await invoice.findOne({
      //   where: { id: req.query.id_invoice },
      //   attributes: ["paidCost"],
      // });

      // let amountDoucost = subtotal - paidCost.paidCost;

      // await invoice.update(
      //   { amountDue: amountDoucost, subtotal: subtotal },
      //   { where: { id: req.query.id_invoice } }
      // );
      return res.status(200).json({
        message: "add package invoice",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
        code: 500,
      });
    }
  }

  async update(req, res) {
    try {
      if (!req.body.name && !req.body.price) {
        await detailInvoice.destroy({
          where: { id_invoice: req.query.id_invoice },
        });
        return res.status(200).json({
          message: "update with empty detail",
          Success: true,
          code: 200,
        });
      }
      let dInvoice = await detailInvoice.findAll({
        where: { id_invoice: req.query.id_invoice },
      });

      dInvoice = [dInvoice].flat(Infinity);
      req.body.name = [req.body.name].flat(Infinity);
      req.body.price = [req.body.price].flat(Infinity);
      req.body.quantity = [req.body.quantity].flat(Infinity);
      console.log(dInvoice.length);
      let update;
      let data = [];
      if (dInvoice.length <= req.body.name.length) {
        for (let i = 0; i < dInvoice.length; i++) {
          update = {
            name: req.body.name[i],
            quantity: req.body.quantity[i],
            price: req.body.price[i],
            amount: req.body.price[i] * req.body.quantity[i],
          };
          let updateData = await detailInvoice.update(update, {
            where: { id: dInvoice[i].id },
          });
          data.push(
            await detailInvoice.findOne({
              where: { id: dInvoice[i].id },
            })
          );
        }

        if (dInvoice.length < req.body.name.length) {
          for (let i = dInvoice.length; i < req.body.name.length; i++) {
            let createData = await detailInvoice.create({
              name: req.body.name[i],
              quantity: req.body.quantity[i],
              price: req.body.price[i],
              amount: req.body.price[i] * req.body.quantity[i],
              id_invoice: req.query.id_invoice,
            });
            data.push(
              await detailInvoice.findOne({
                where: { id: createData.id },
              })
            );
          }
        }
      }

      if (req.body.name.length < dInvoice.length) {
        for (let i = 0; i < req.body.name.length; i++) {
          update = await {
            name: req.body.name[i],
            quantity: req.body.quantity[i],
            price: req.body.price[i],
            amount: req.body.price[i] * req.body.quantity[i],
          };
          let updateData = await detailInvoice.update(update, {
            where: { id: dInvoice[i].id },
          });
          data.push(
            await detailInvoice.findOne({
              where: { id: dInvoice[i].id },
            })
          );
        }
        for (let i = req.body.name.length; i < dInvoice.length; i++) {
          await detailInvoice.destroy({
            where: { id: dInvoice[i].id },
          });
        }
      }

      let subtotal = await detailInvoice
        .sum("amount", { where: { id_invoice: req.query.id_invoice } })
        .then((sum) => sum);
      let paidCost = await invoice.findOne({
        where: { id: req.query.id_invoice },
        attributes: ["paidCost"],
      });

      let amountDoucost = subtotal - paidCost.paidCost;

      await invoice.update(
        { amountDue: amountDoucost },
        { where: { id: req.query.id_invoice } }
      );

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
      });
    }
  }

  async delete(req, res) {
    try {
      // Delete data
      let data = await detailInvoice.destroy({
        where: { id: req.query.id_detailInvoice },
      });

      // If data deleted is null
      if (!data) {
        return res.status(404).json({
          message: "detailInvoice not found",
          Success: false,
          code: 404,
        });
      }

      // If success
      return res.status(200).json({
        message: "Success delete detailInvoice",
        Success: true,
        code: 200,
      });
    } catch (e) {
      // If error
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
        Success: false,
        code: 400,
      });
    }
  }
}

module.exports = new DetailInvoiceController();
