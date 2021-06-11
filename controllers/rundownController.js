const { user, project, rundown } = require("../models"); // Import all models

class RundownController {
  // Get all
  async getAll(req, res) {
    try {
      let page = parseInt(req.query.page) || 0;
      let limit = parseInt(req.query.limit) || 10;
      const offset = page ? page * limit : 0;
      let data = await rundown.findAll({
        offset: offset,
        limit: limit,
      });
      let count = await rundown.count({});
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
      let data = await rundown.findAll({
        where: { id_project: req.query.id },
        attributes: [["id", "id_rundown"], "id_project", "person"],
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

  async create(req, res) {
    try {
      let createdData = await rundown.create({
        id_project: req.body.id_project,
        person: req.body.person,
      });

      let data = await rundown.findOne({
        where: {
          id: createdData.id,
        },
        attributes: ["id_project", "person"],
        include: [
          // Include is join
          { model: project, attributes: ["clientName"] },
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
        id_project: req.body.id_project,
        person: req.body.person,
      };
      // Transaksi table update data
      let updatedData = await rundown.update(update, {
        where: {
          id: req.query.id,
        },
      });

      // Find the updated transaksi
      let data = await rundown.findOne({
        where: {
          id: req.query.id,
        },
        attributes: ["id_project", "person"],
        include: [
          // Include is join
          { model: project, attributes: ["clientName"] },
        ],
      });

      // If success
      return res.status(201).json({
        message: "Success",
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
  async delete(req, res) {
    try {
      // Delete data
      let data = await rundown.destroy({ where: { id: req.query.id } });

      // If success
      return res.status(200).json({
        message: "Success Delete Rundown",
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

module.exports = new RundownController();
