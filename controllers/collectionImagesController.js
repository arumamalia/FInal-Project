const { collection, collectionImages } = require("../models");
const crypto = require("crypto");
const path = require("path");
const uploadImage = require("../middlewares/uploads/imageUpload");

class CollectionImagesController {
  async getAll(req, res) {
    try {
      let data = await collectionImages.findAll({
        attributes: ["image"],
      });

      if (data.length === 0) {
        return res.status(404).json({
          message: "Collection Not Found",
          success: false,
          code: 404,
        });
      }

      return res.status(200).json({
        message: "get all image",
        success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
        code: 500,
        error: e.message,
      });
    }
  }

  async getAllByCollection(req, res) {
    try {
      let data = await collectionImages.findAll({
        where: { id_collection: req.query.id_collection },
        attributes: ["id", "image"],
      });

      if (data.length === 0) {
        return res.status(404).json({
          message: "Collection Not Found",
          success: false,
          code: 404,
        });
      }

      return res.status(200).json({
        message: "get all image by collection",
        success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
        code: 500,
        error: e.message,
      });
    }
  }

  async getOne(req, res) {
    try {
      let data = await collectionImages.findOne({
        where: { id: `${req.query.id}` },

        attributes: ["id", "image"],
      });

      if (!data) {
        return res.status(404).json({
          message: "Image Not Found",
          success: false,
          code: 404,
        });
      }

      return res.status(200).json({
        message: "get one image",
        success: true,
        code: 200,
        result: data,
      });
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
        code: 500,
        error: e.message,
      });
    }
  }

  uploads = async (req, res, i) => {
    let file;
    if (req.files.image.length > 1) {
      file = req.files.image[i];
    } else {
      file = req.files.image;
    }
    if (!file.mimetype.startsWith("image")) {
      return res.status(400).json({ message: "File must be an image " });
    }

    if (file.size > 1000000) {
      return res.status(400).json({ message: "Image must be less than 1MB" });
    }

    let fileName = crypto.randomBytes(16).toString("hex");

    file.name = `${fileName}${path.parse(file.name).ext}`;

    req.body.image = file.name;
    try {
      await file.mv(`./public/${file.name}`, (err) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "Internal Server Error",
            error: err,
          });
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  create = async (req, res, next) => {
    try {
      let image = [];
      let data = [];
      let createData;
      let file;
      if (req.files.image.length > 1) {
        file = req.files.image;
      } else {
        file = [req.files.image];
      }

      let findCollection = await collection.findOne({
        where: { id: req.body.id_collection },
      });

      if (req.files) {
        if (file.length > 0) {
          for (let i = 0; i < file.length; i++) {
            image = await uploadImage.uploadImage(
              req.files,
              `collectionImage/${req.body.id_collection}`,
              i
            );

            for (let j = 0; j < image.length; j++) {
              createData = await collectionImages.create({
                id_collection: req.body.id_collection,
                image: image[j],
              });
              data.push(
                await collectionImages.findOne({
                  where: { id: createData.id },
                })
              );
            }
          }
        }
      }

      return res.status(200).json({
        message: "upload multi image to collection",
        success: true,
        code: 200,
        result: data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
        code: 500,
        error: error.message,
      });
    }
  };
  async delete(req, res) {
    try {
      let err;
      let findData = await collectionImages.findOne({
        where: { id: req.query.id },
      });
      let idCompress = await (parseInt(req.query.id) - 1);

      let findDatacompress = await collectionImages.findOne({
        where: { id: idCompress },
      });

      if (!findData) {
        return res.status(404).json({
          message: "Collection Images Not Found",
          success: false,
          code: 404,
        });
      }
      if (!findDatacompress) {
        return res.status(404).json({
          message: "Collection Images Not Found",
          success: false,
          code: 404,
        });
      }

      await uploadImage.deleteImage(findData.image.slice(47));
      await uploadImage.deleteImage(findDatacompress.image.slice(47));
      await collectionImages.destroy({
        where: { id: req.query.id },
        force: true,
      });
      console.log(req.query.id);
      await collectionImages.destroy({
        where: { id: idCompress },
        force: true,
      });

      return res.status(200).json({
        message: "Success delete collection Images",
        success: true,
        code: 200,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
        code: 500,
        error: e.message,
      });
    }
  }
}

module.exports = new CollectionImagesController();
