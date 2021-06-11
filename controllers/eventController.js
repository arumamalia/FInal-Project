const { user, project, rundown, event } = require("../models"); // Import all models

class EventController {
  // Get all
  async getAll(req, res) {
    try {
      let page = parseInt(req.query.page) || 0;
      let limit = parseInt(req.query.limit) || 10;
      const offset = page ? page * limit : 0;
      let data = await event.findAll({
        offset: offset,
        limit: limit,
      });
      let count = await event.count({});
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
      let data = await event.findAll({ where: { id_rundown: req.query.id } });

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

  // Create barang
  async create(req, res) {
    try {
      let createdData = await event.create({
        name: req.body.name,
        from: req.body.from,
        to: req.body.to,
        theme: req.body.theme,
        description: req.body.description,
        id_rundown: req.body.id_rundown,
      });

      let data = await event.findOne({
        where: {
          id: createdData.id,
        },
        include: [
          // Include is join
          { model: rundown, attributes: ["person"] },
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
        name: req.body.name,
        from: req.body.from,
        to: req.body.to,
        theme: req.body.theme,
        description: req.body.description,
      };
      // Transaksi table update data
      let updatedData = await event.update(update, {
        where: {
          id: req.query.id,
        },
      });

      // Find the updated transaksi
      let data = await event.findOne({
        where: {
          id: req.query.id,
        },
        include: [
          // Include is join
          { model: rundown, attributes: ["person"] },
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
      let data = await event.destroy({ where: { id: req.query.id } });

      // If data deleted is null
      if (!data) {
        return res.status(404).json({
          message: "Event Not Found",
        });
      }

      // If success
      return res.status(200).json({
        message: "Success Delete Event",
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

module.exports = new EventController();
