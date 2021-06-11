const crypto = require("crypto");
const bcrypt = require("bcrypt");
const path = require("path");
const { collection, collectionImages, user } = require("../models");
const sequelize = require("sequelize");
const uploadImage = require("../middlewares/uploads/imageUpload");
const Op = sequelize.Op;
const errorHandler = (err, req, res, next) => {
  if (err.length > 0) {
    return res.status(400).json({
      message: err.join(", "),
      success: false,
      code: 400,
    });
  }
};

class CollectionController {
  async getAll(req, res) {
    try {
      let page = parseInt(req.query.page) || 0;
      let limit = parseInt(req.query.limit) || 10;
      const offset = page ? page * limit : 0;
      let data = await collection.findAll({
        where: {
          showGallery: true,
        },
        offset: offset,
        limit: limit,
        include: [
          { model: user, attributes: ["businessName"] },
          { model: collectionImages, attributes: ["id", "image"] },
        ],
      });
      // let count = await collection.count({});
      let count = data.length;
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
      console.log(e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
        Success: false,
        code: 500,
      });
    }
  }

  async getAlloneUserPhoto(req, res) {
    try {
      let page = parseInt(req.query.page) || 0;
      let limit = parseInt(req.query.limit) || 10;
      const offset = page ? page * limit : 0;
      let data = await collection.findAll({
        where: {
          id_user: req.query.id_user,
        },
        offset: offset,
        limit: limit,
        include: [
          { model: user, attributes: ["photo", "name", "businessName"] },
          { model: collectionImages, attributes: ["id", "image"] },
        ],
      });
      // let count = await collection.count({});
      let count = data.length;
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
      console.log(e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
        Success: false,
        code: 500,
      });
    }
  }

  async getForAllPhotographer(req, res, next) {
    try {
      let data = await collection.findAll({
        where: { id_user: req.user.id },
        attributes: {},
        include: [{ model: collectionImages }],
      });

      return res.status(200).json({
        message: "Get all collection",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
      return next(e);
    }
  }

  async getOne(req, res) {
    try {
      let data = await collection.findOne({
        where: { id: req.query.id_collection },

        attributes: [
          "id",
          "id_user",
          "cover",
          "title",
          "description",
          "date",
          "theme",
          "showGallery",
          "downloadOption",
          "limit",
          "totalDownload",
          "password",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: collectionImages,
            attributes: ["id", "image"],
          },
          {
            model: user,
            attributes: ["name", "businessName", "photo"],
          },
        ],
      });

      if (!data) {
        return res.status(404).json({
          message: "Collection Not Found",
          Success: false,
          code: 400,
        });
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

  async filter(req, res, next) {
    try {
      let choose = ["Minimalism", "Dark Mode", "Classic", "1", "2", "0", "3"];
      let arr = [];
      let publicFilter = req.query.public;
      let privateFilter;
      if (req.query.private == 1) {
        privateFilter = 0;
      } else if (req.query.private == 0) {
        privateFilter = 1;
      }

      delete req.query.public;
      delete req.query.private;

      let arrGallery = Object.values(req.query);
      for (let i = 0; i < arrGallery.length; i++) {
        if (choose.includes(arrGallery[i])) {
          arr.push(arrGallery[i]);
        }
      }
      let data = await collection.findAll({
        where: {
          id_user: req.user.id,
          theme: { [Op.or]: arr },
          showGallery: { [Op.in]: [privateFilter, publicFilter] },
        },
        attributes: {},
      });

      return res.status(200).json({
        message: "Get all collection",
        Success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  async search(req, res) {
    try {
      let page = parseInt(req.query.page) || 0;
      let limit = parseInt(req.query.limit) || 10;
      const offset = page ? page * limit : 0;
      let data = await collection.findAll({
        where: {
          id_user: req.user.id,
          title: { [Op.like]: `%${req.query.title}%` },
        },
        offset: offset,
        limit: limit,
      });
      console.log(data);
      let count = data.length;
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
      console.log(e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  }

  async searchAll(req, res) {
    try {
      let page = parseInt(req.query.page) || 0;
      let limit = parseInt(req.query.limit) || 10;
      const offset = page ? page * limit : 0;
      let data = await collection.findAll({
        where: {
          id_user: req.query.id_user,
          title: { [Op.like]: `%${req.query.title}%` },
        },
        offset: offset,
        limit: limit,
      });
      // let count = await collection.count({});
      let count = data.length;
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
      console.log(e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  }
  async create(req, res) {
    try {
      let cover = await uploadImage.uplaodOneImage(req.files, `collection`);
      let createdData = await collection.create({
        title: req.body.title,
        description: req.body.description,
        cover: cover,
        date: req.body.date,
        theme: req.body.theme,
        showGallery: req.body.showGallery,
        downloadOption: req.body.downloadOption,
        id_user: req.user.id,
      });
      console.log(cover);

      await collectionImages.update(
        { id_collection: createdData.id },
        { where: { id_collection: null } }
      );

      let data = await collection.findOne({
        where: {
          id: createdData.id,
        },
        attributes: [
          "id",
          "id_user",
          "cover",
          "title",
          "description",
          "date",
          "showGallery",
          "downloadOption",
          "theme",
          "createdAt",
          "updatedAt",
        ],
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
      let encryptPassword;
      if (req.body.password) {
        encryptPassword = await bcrypt.hash(req.body.password, 10);
      } else {
        encryptPassword = null;
      }
      let update;
      if (req.files) {
        let cover = await uploadImage.uplaodOneImage(req.files, `collection`);
        update = {
          title: req.body.title,
          description: req.body.description,
          cover: cover,
          date: req.body.date,
          theme: req.body.theme,
          showGallery: req.body.showGallery,
          downloadOption: req.body.downloadOption,
          id_user: req.user.id,
          password: encryptPassword,
          limit: req.body.limit,
        };
      } else {
        update = {
          title: req.body.title,
          description: req.body.description,
          date: req.body.date,
          theme: req.body.theme,
          showGallery: req.body.showGallery,
          downloadOption: req.body.downloadOption,
          id_user: req.user.id,
          password: encryptPassword,
          limit: req.body.limit,
        };
      }

      let updatedData = await collection.update(update, {
        where: {
          id: req.query.id_collection,
        },
      });

      let data = await collection.findOne({
        where: { id: req.query.id_collection },
        attributes: [
          "id",
          "id_user",
          "cover",
          "title",
          "description",
          "date",
          "theme",
          "showGallery",
          "downloadOption",
          "createdAt",
          "updatedAt",
        ],
      });

      return res.status(200).json({
        message: "Colection is already up to date",
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

  async updateCover(req, res) {
    try {
      req.query.id_collectionImages =
        parseInt(req.query.id_collectionImages) - 1;
      console.log(req.query.id_collectionImages);
      let findImage = await collectionImages.findOne({
        where: {
          id: req.query.id_collectionImages,
        },
      });
      let cover = await findImage.image.slice(47);
      let update = {
        cover: cover,
      };

      let updatedData = await collection.update(update, {
        where: {
          id: req.query.id_collection,
        },
      });

      let data = await collection.findOne({
        where: { id: req.query.id_collection },
        attributes: [
          "id",
          "id_user",
          "cover",
          "title",
          "description",
          "date",
          "theme",
          "showGallery",
          "downloadOption",
          "createdAt",
          "updatedAt",
        ],
      });

      return res.status(200).json({
        message: "Colection is already up to date",
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
  async createPassword(req, res, next) {
    try {
      let errors = [];
      let passw = await collection.findOne({
        where: { id: req.query.id_collection },
      });

      // for (let i = 0; i < passw.length; i++) {
      if (passw.password) {
        errors.push("Passowrd already exist");
        return errorHandler(errors, req, res, next);
      }
      // }

      const encryptPassword = await bcrypt.hash(req.body.password, 10);
      // console.log(encryptPassword);

      let update = {
        password: encryptPassword,
        id_collection: req.query.id_collection,
      };

      let updateData = await collection.update(update, {
        where: { id: req.query.id_collection },
      });

      let data = await collection.findOne({
        where: { id: req.query.id_collection },
      });

      return res.status(200).json({
        message: "Successfully created password",
        success: true,
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

  async submit(req, res, next) {
    try {
      let errors = [];

      let findData = await collection.findOne({
        where: { id: req.query.id_collection },
      });

      if (!findData) {
        errors.push("collection not found");
        return errorHandler(errors, req, res, next);
      }

      let data = await collection.findOne({
        where: { id: req.query.id_collection },
      });

      const validate = await bcrypt.compare(req.body.password, data.password);

      if (!validate) {
        errors.push("Wrong Password");
        return errorHandler(errors, req, res, next);
      }

      return res.status(201).json({
        message: "Success",
        Success: true,
        code: 200,
      });

      next();
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
        success: false,
        code: 500,
      });
    }
  }

  async downloadCollection(req, res) {
    try {
      let option;
      if (req.query.option == 1) {
        option = "original";
      } else if (req.query.option == 2) {
        option = "compress";
      } else {
        return res.status(400).json({
          message: "input 1 or 2",
          code: 400,
        });
      }
      let url = `http://portraiture.gabatch11.my.id/collectionImages/download/${req.query.id_collection}/${option}`;

      return res.status(200).json({
        message: "success",
        code: 200,
        result: url,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
        success: false,
        code: 500,
      });
    }
  }

  async downloadSetting(req, res) {
    try {
      let update = {
        original: req.body.original,
        compress: req.body.compress,
        limit: req.body.limit,
      };

      let updateData = await collection.update(update, {
        where: { id: req.query.id_collection },
      });

      let data = await collection.findOne({
        where: { id: req.query.id_collection },
      });

      return res.status(200).json({
        message: "download setting",
        success: true,
        result: data,
      });
      next();
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
        success: false,
        code: 500,
      });
    }
  }

  async delete(req, res) {
    try {
      let data = await collection.destroy({
        where: { id: req.query.id_collection },
      });

      if (!data) {
        return res.status(404).json({
          message: "Collection Not Found",
          Success: false,
          code: 404,
        });
      }

      return res.status(200).json({
        message: "Success delete collection",
        Success: true,
        code: 200,
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
}

module.exports = new CollectionController();
