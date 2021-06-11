const crypto = require("crypto");
const path = require("path");
const { packager, category, packageItem, project } = require("../models");
const sequelize = require("sequelize");
const uploadImage = require("../middlewares/uploads/imageUpload");
const Op = sequelize.Op;
class PackagerController {
  // Get all
  async getAll(req, res, next) {
    try {
      let data = await packager.findAll({
        where: { id_user: req.user.id },
        include: [
          {
            model: packageItem,
            attributes: ["itemName", "price"],
            include: [{ model: category, attribute: ["name"] }],
          },
        ],
      });

      return res.status(200).json({
        message: "Get all package",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
      return next(e);
    }
  }

  async filter(req, res, next) {
    try {
      let modelCategory;
      let arr = [];
      let max = req.query.max || 10000000;
      let min = req.query.min || 0;
      let choose = [
        "Photo Session",
        "Videography",
        "Print",
        "Digital",
        "Other",
        min,
        max,
      ];
      let array = Object.values(req.query);
      console.log(array.length);
      for (let i = 0; i < array.length; i++) {
        if (choose.includes(array[i])) {
          arr.push(array[i]);
        }
      }
      if (arr.length > 2) {
        modelCategory = {
          model: category,
          attributes: ["name"],
          where: {
            name: {
              [Op.or]: arr,
            },
          },
        };
      } else {
        modelCategory = {
          model: category,
          attributes: ["name"],
        };
      }
      let data = await packager.findAll({
        where: {
          id_user: req.user.id,
          totalPrice: { [Op.between]: [min, max] },
        },
        include: [
          {
            model: packageItem,
            attributes: ["id", "itemName", "price"],
            where: { id: { [Op.not]: null } },
            include: [modelCategory],
          },
        ],
      });

      return res.status(200).json({
        message: "Get all package",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  async search(req, res, next) {
    try {
      let data = await packager.findAll({
        where: {
          id_user: req.user.id,
          name: { [Op.like]: `%${req.query.name}%` },
        },
        include: [
          {
            model: packageItem,
            attributes: ["itemName", "price"],
            include: [{ model: category, attribute: ["name"] }],
          },
        ],
      });

      return res.status(200).json({
        message: "Get all package by search",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
      return next(e);
    }
  }

  async getForAllPhotographer(req, res, next) {
    try {
      let data = await packager.findAll({
        include: [
          {
            model: packageItem,
            attributes: ["itemName", "price"],
            include: [{ model: category, attribute: ["name"] }],
          },
        ],
      });

      return res.status(200).json({
        message: "Get all package",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
      return next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      let data = await packager.findOne({
        where: { id: req.query.packageId },
        attributes: [["id", "id_package"], "name", "description", "image"],

        include: [
          {
            model: packageItem,
            attributes: ["itemName", "price"],
            include: [{ model: category, attributes: ["name"] }],
          },
        ],
      });

      return res.status(200).json({
        message: "Get One package",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
      return next(e);
    }
  }

  async create(req, res, next) {
    try {
      let createData;

      if (req.files) {
        let image = await uploadImage.uplaodOneImage(req.files, `package`);

        createData = await packager.create({
          name: req.body.name,
          description: req.body.description,
          image: image,
          id_project: req.body.projectId,
          id_user: req.user.id,
        });
      } else {
        createData = await packager.create({
          name: req.body.name,
          description: req.body.description,
          id_project: req.body.projectId,
          id_user: req.user.id,
        });
      }
      await packageItem.update(
        { id_package: createData.id },
        { where: { id_package: null } }
      );

      // let itemCount = await packageItem.count("id_package", {
      //   where: { id_package: createData.id },
      // });
      let itCount = await packageItem.findAll({
        where: { id_package: createData.id },
      });
      let itemCount = itCount.length;
      let price = await packageItem.sum("price", {
        where: { id_package: createData.id },
      });
      await packager.update(
        { itemCount: itemCount, totalPrice: price },
        { where: { id: createData.id } }
      );

      let data = await packager.findOne({
        where: { id: createData.id },
        attributes: [
          "id",
          "name",
          "description",
          "image",
          "itemCount",
          "totalPrice",
        ],
      });
      return res.status(200).json({
        message: "created package",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
      return next(e);
    }
  }

  async update(req, res, next) {
    try {
      let update;
      if (req.files) {
        let image = await uploadImage.uplaodOneImage(req.files, `package`);
        update = {
          name: req.body.name,
          description: req.body.description,
          image: image,
          id_project: req.body.projectId,
          id_user: req.user.id,
        };
      } else {
        update = {
          name: req.body.name,
          description: req.body.description,
          id_project: req.body.projectId,
          id_user: req.user.id,
        };
      }

      let updateData = await packager.update(update, {
        where: { id: req.body.packageId },
      });
      let itCount = await packageItem.findAll({
        where: { id_package: req.body.packageId },
      });
      let itemCount = itCount.length;
      let price = await packageItem.sum("price", {
        where: { id_package: req.body.packageId },
      });

      await packager.update(
        { itemCount: itemCount, totalPrice: price },
        { where: { id: req.body.packageId } }
      );

      let data = await packager.findOne({
        where: { id: req.body.packageId },
        attributes: ["id", "name", "description", "image"],
      });
      return res.status(200).json({
        message: "updated package",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async delete(req, res) {
    try {
      // Delete data
      await project.update(
        { id_package: null },
        { where: { id_package: req.query.packageId } }
      );
      let data = await packager.destroy({ where: { id: req.query.packageId } });
      // If data deleted is null
      if (!data) {
        return next({ message: "Package not found", statusCode: 404 });
      }

      // If success
      return res.status(200).json({
        message: "Success delete package",
        Success: true,
        code: 200,
      });
    } catch (e) {
      // If error
      return next(e);
    }
  }
}

module.exports = new PackagerController();
