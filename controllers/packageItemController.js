const crypto = require("crypto");
const path = require("path");
const { packageItem, category, packager } = require("../models");
const sequelize = require("sequelize");

class PackageItemController {
  // Get all
  async getAll(req, res) {
    try {
      let data = await packageItem.findAll({
        include: [{ model: category, attributes: ["name"] }],
      });
      return res.status(200).json({
        message: "Get all package item",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
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
      let data = await packageItem.findOne({
        where: { id: req.query.packageItemId },
      });

      // if (!data) {
      //   return res.status(404).json({
      //     message: "package item not found",
      //     Success: false,
      //     code: 404,
      //   });
      // }
      return res.status(200).json({
        message: "Get One package item",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
        Success: false,
        code: 500,
      });
    }
  }

  async getByPackage(req, res) {
    try {
      let findData = await packager.findOne({
        where: { id: req.query.packageId },
      });
      if (!findData) {
        return res.status(404).json({
          message: "package not found",
          Success: false,
          code: 404,
        });
      }
      let data = await packageItem.findAll({
        where: { id_package: req.query.packageId },
      });
      return res.status(200).json({
        message: "Get package item by package id",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
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
      if (!req.body.itemName && !req.body.price) {
        return res.status(200).json({
          message: "input empty data",
          Success: true,
          code: 200,
        });
      }

      req.body.itemName = [req.body.itemName].flat(Infinity);
      req.body.price = [req.body.price].flat(Infinity);
      req.body.id_category = [req.body.id_category].flat().flat();
      let data = [];
      for (let i = 0; i < req.body.itemName.length; i++) {
        let createData = await packageItem.create({
          itemName: req.body.itemName[i],
          price: req.body.price[i],
          id_category: req.body.id_category[i],
          id_package: req.body.packageId,
        });

        data.push(
          await packageItem.findOne({
            where: { id: createData.id },
            attributes: ["id", "itemName", "price", "id_package"],
          })
        );
      }
      return res.status(200).json({
        message: "created package item",
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
      if (!req.body.itemName && !req.body.price) {
        await packageItem.destroy({
          where: { id_package: req.body.packageId },
        });
        return res.status(200).json({
          message: "update with empty item",
          Success: true,
          code: 200,
        });
      }
      let dataPackage = await packageItem.findAll({
        where: { id_package: req.body.packageId },
      });
      dataPackage = [dataPackage].flat(Infinity);
      req.body.itemName = [req.body.itemName].flat(Infinity);
      req.body.price = [req.body.price].flat(Infinity);
      req.body.id_category = [req.body.id_category].flat().flat();

      let update;
      let data = [];
      if (dataPackage.length <= req.body.itemName.length) {
        for (let i = 0; i < dataPackage.length; i++) {
          update = await {
            itemName: req.body.itemName[i],
            price: req.body.price[i],
            id_category: req.body.id_category[i],

            // id_category: req.body.categoryId[i],
          };
          let updateData = await packageItem.update(update, {
            where: { id: dataPackage[i].id },
          });
          data.push(
            await packageItem.findOne({
              where: { id: dataPackage[i].id },
              attributes: ["id", "itemName", "price", "id_package"],
            })
          );
        }
        if (dataPackage.length < req.body.itemName.length) {
          for (let i = dataPackage.length; i < req.body.itemName.length; i++) {
            let createData = await packageItem.create({
              itemName: req.body.itemName[i],
              price: req.body.price[i],
              id_category: req.body.id_category[i],
              id_package: req.body.packageId,
            });

            data.push(
              await packageItem.findOne({
                where: { id: createData.id },
                attributes: ["id", "itemName", "price", "id_package"],
              })
            );
          }
        }
      }

      if (req.body.itemName.length < dataPackage.length) {
        for (let i = 0; i < req.body.itemName.length; i++) {
          update = await {
            itemName: req.body.itemName[i],
            price: req.body.price[i],
            id_category: req.body.id_category[i],

            // id_category: req.body.categoryId[i],
          };
          let updateData = await packageItem.update(update, {
            where: { id: dataPackage[i].id },
          });
          data.push(
            await packageItem.findOne({
              where: { id: dataPackage[i].id },
              attributes: ["id", "itemName", "price", "id_package"],
            })
          );
        }
        for (let i = req.body.itemName.length; i < dataPackage.length; i++) {
          await packageItem.destroy({
            where: { id: dataPackage[i].id },
          });
        }
      }

      return res.status(200).json({
        message: "updated package",
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

  async delete(req, res) {
    try {
      // Delete data
      let data = await packageItem.destroy({
        where: { id: req.query.packageItemId },
      });

      // If data deleted is null
      if (!data) {
        return res.status(404).json({
          message: "Package item not found",
          Success: false,
          code: 404,
        });
      }

      // If success
      return res.status(200).json({
        message: "Success delete package item",
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

module.exports = new PackageItemController();
