const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const path = require("path");
const { user } = require("../models");
// const { nextTick } = require("process");
const uploadImage = require("../middlewares/uploads/imageUpload");

class userController {
  async getAll(req, res, next) {
    try {
      let data = await user.findAll({
        attributes: ["id", "name", "businessName", "email", "photo", "address"],
      });

      if (data.length == 0) {
        return next({
          message: "user not found",
          Success: false,
          code: 404,
        });
      }

      return res.status(200).json({
        message: "Get all user",
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
      let data = await user.findOne({
        where: { id: req.user.id },
        attributes: ["id", "name", "businessName", "email", "photo", "address"],
      });

      if (!data) {
        return next({
          message: "user not found",
          Success: false,
          code: 404,
        });
      }

      return res.status(200).json({
        message: "Get One user",
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
      if (!req.files) {
        update = {
          name: req.body.name,
          businessName: req.body.businessName,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
          address: req.body.address,
        };
      } else {
        update = {
          name: req.body.name,
          businessName: req.body.businessName,
          photo: req.body.photo,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
          address: req.body.address,
        };
      }

      // ini req.query.id siapa yg manggil
      // if (req.user.id != req.query.id) {
      //   return res.status(404).json({ message: "Id User is not found" });
      // }
      // Transaksi table update data

      let dataUser = await user.update(update, {
        where: {
          id: req.user.id,
        },
      });

      // Find the updated transaksi
      let data = await user.findOne({
        where: { id: req.user.id },
        attributes: ["id", "name", "businessName", "email", "photo", "address"],
      });

      if (!dataUser) {
        return next({
          message: "Id user is not found",
          Success: false,
          code: 404,
        });
      }
      // If success
      return res.status(200).json({
        message: "updated user",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
      // If error

      return next(e);
    }
  }
  async delete(req, res, next) {
    try {
      // Delete data
      let data = await user.destroy({ where: { id: req.query.id } });

      // If data deleted is null
      if (!data) {
        return next({ message: "id user is not found", statusCode: 404 });
      }

      // If success
      return res.status(200).json({
        message: "Success delete user",
        Success: true,
        code: 200,
      });
    } catch (e) {
      // If error
      return next(e);
    }
  }
}

module.exports = new userController();
