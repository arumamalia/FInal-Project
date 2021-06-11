const express = require("express");
const router = express.Router();

const collectionImagesController = require("../controllers/collectionImagesController");
const {
  middlewareDownload,
} = require("../controllers/donwloadImagesController");
const downloadImageController = require("../controllers/donwloadImagesController");
const collectionImagesValidator = require("../middlewares/validators/collectionImagesValidator");

router.get("/", collectionImagesController.getAll);
router.get("/bycollection", collectionImagesController.getAllByCollection);
router.get("/one", collectionImagesController.getOne);
router.get(
  "/download/:id/:type",
  downloadImageController.middlewareDownload,
  downloadImageController.downloadCollection
);
router.post(
  "/",
  collectionImagesValidator.create,
  collectionImagesController.create
);

router.delete("/one", collectionImagesController.delete);

module.exports = router;
