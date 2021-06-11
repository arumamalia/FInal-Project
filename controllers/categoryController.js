const { category, packageItem } = require("../models");

class CategoryController {
  async getAll(req, res) {
    try {
      let data = await category.findAll({});
      return res.status(200).json({
        message: "Get all category",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
      // console.log(e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  }

  async getOne(req, res) {
    try {
      let data = await category.findOne({
        where: { id: req.query.categoryId },
      });

      if (!data) {
        return res.status(400).json({
          message: "category not found",
          success: false,
          code: 400,
        });
      }

      return res.status(200).json({
        message: "Success",
        data,
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
      let createData = await category.create({
        name: req.body.name,
        // id_packageItem: req.body.packageItemId,
      });

      let data = await category.findOne({
        where: { id: createData.id },
        attributes: ["name"],
        // includes: [
        //   {
        //     model: packageItem,
        //     attributes: ["itemName", "price"],
        //   },
        // ],
      });
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  }

  async update(req, res) {
    try {
      let update = {
        name: req.body.name,
        //   id_packageItem: req.body.packageItemId,
      };
      let updateData = await category.update(update, {
        where: { id: req.body.categoryId },
      });
      let data = await category.findOne({
        where: { id: req.body.categoryId },
      });

      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      // Delete data
      let data = await category.destroy({
        where: { id: req.query.categoryId },
      });

      // If data deleted is null
      if (!data) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      // If success
      return res.status(200).json({
        message: "Success delete category",
      });
    } catch (e) {
      // If error
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  }
}

module.exports = new CategoryController();
