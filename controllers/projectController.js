const { user, project, packager } = require("../models"); // Import all models
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

class ProjectController {
  // Get all
  async getAll(req, res) {
    try {
      let page = parseInt(req.query.page) || 0;
      let limit = parseInt(req.query.limit) || 10;
      const offset = page ? page * limit : 0;

      let data = await project.findAll({
        where: { id_user: req.user.id },
        offset: offset,
        limit: limit,
      });
      let count = await project.count({ where: { id_user: req.user.id } });
      return res.status(200).json({
        message: "Success",
        Success: true,
        code: 200,
        result: data,
        pageSize: data.length,
        currentPageNumber: page + 1,
        totalData: count,
        totalPage: Math.ceil(count / limit),
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
      let data = await project.findOne({
        where: { id: req.query.id, id_user: req.user.id },
      });

      return res.status(200).json({
        message: "Success",
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
  async filterCompleted(req, res) {
    try {
      let page = parseInt(req.query.page) || 0;
      let limit = parseInt(req.query.limit) || 10;
      const offset = page ? page * limit : 0;
      let data = await project.findAll({
        where: { isCompleted: req.query.isCompleted, id_user: req.user.id },
        offset: offset,
        limit: limit,
      });
      let count = await project.count({
        where: { isCompleted: req.query.isCompleted, id_user: req.user.id },
      });
      return res.status(200).json({
        message: "Success",
        Success: true,
        code: 200,
        result: data,
        pageSize: data.length,
        currentPageNumber: page + 1,
        totalData: count,
        totalPage: Math.ceil(count / limit),
      });
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  }
  async search(req, res) {
    try {
      let page = parseInt(req.query.page) || 0;
      let limit = parseInt(req.query.limit) || 10;
      const offset = page ? page * limit : 0;
      let data = await project.findAll({
        where: {
          id_user: req.user.id,
          title: { [Op.like]: `%${req.query.title}%` },
        },
        offset: offset,
        limit: limit,
      });
      let count = await project.count({ where: { id_user: req.user.id } });
      return res.status(200).json({
        message: "Success",
        Success: true,
        code: 200,
        result: data,
        pageSize: data.length,
        currentPageNumber: page + 1,
        totalData: count,
        totalPage: Math.ceil(count / limit),
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
      let createdData = await project.create({
        id_user: req.user.id,
        title: req.body.title,
        date: req.body.date,
        description: req.body.description,
        clientName: req.body.clientName,
        clientAddress: req.body.clientAddress,
      });

      let data = await project.findOne({
        where: {
          id: createdData.id,
        },
        attributes: [
          "id",
          "id_user",
          "title",
          "date",
          "description",
          "clientName",
          "clientAddress",
        ],
        include: [
          // Include is join
          { model: user, attributes: ["name"] },
        ],
      });

      return res.status(200).json({
        message: "Success",
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
  async update(req, res) {
    try {
      let update = {
        id_user: req.user.id,
        title: req.body.title,
        date: req.body.date,
        description: req.body.description,
        clientName: req.body.clientName,
        clientAddress: req.body.clientAddress,
        isCompleted: req.body.isCompleted,
      };

      let updatedData = await project.update(update, {
        where: {
          id: req.query.id,
          id_user: req.user.id,
        },
      });

      let data = await project.findOne({
        where: {
          id: req.query.id,
          id_user: req.user.id,
        },
        attributes: [
          "id",
          "id_user",
          "title",
          "date",
          "description",
          "clientName",
          "clientAddress",
        ],
        include: [{ model: user, attributes: ["name"] }],
      });

      return res.status(201).json({
        message: "Success",
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

  async addPackage(req, res) {
    try {
      let update = {
        id_package: req.body.id_package,
      };

      let updatedData = await project.update(update, {
        where: {
          id: req.query.id,
        },
      });

      let data = await project.findOne({
        where: {
          id: req.query.id,
        },
        attributes: [
          "id",
          "id_user",
          "title",
          "date",
          "description",
          "clientName",
          "clientAddress",
        ],
        include: [
          { model: user, attributes: ["name"] },
          { model: packager, attributes: ["name"] },
        ],
      });

      return res.status(201).json({
        message: "Success",
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
  async delete(req, res) {
    try {
      let data = await project.destroy({
        where: { id: req.query.id, id_user: req.user.id },
      });

      return res.status(200).json({
        message: "Success Delete Project",
        Success: true,
        code: 200,
        result: data,
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

module.exports = new ProjectController();
