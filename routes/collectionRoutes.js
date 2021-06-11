const express = require("express");
const router = express.Router();
const collectionValidator = require("../middlewares/validators/collectionValidator");
const collectionController = require("../controllers/collectionController");
const auth = require("../middlewares/auth");

router.get("/", collectionController.getAll);
router.get(
  "/all",
  auth.photographer,
  collectionController.getForAllPhotographer
);
router.get("/one", collectionController.getOne);
router.get("/download", collectionController.downloadCollection);
router.get("/search", auth.photographer, collectionController.search);
router.get("/searchClient", collectionController.searchAll);
router.get("/oneUser", collectionController.getAlloneUserPhoto);
router.put(
  "/createPassword",
  auth.photographer,
  collectionController.createPassword
);
router.post("/submit", collectionController.submit);

router.get("/filter", auth.photographer, collectionController.filter);
router.post(
  "/",
  auth.photographer,
  collectionValidator.create,
  collectionController.create
);
router.put(
  "/",
  auth.photographer,
  collectionValidator.update,
  collectionController.update
);
router.put(
  "/downloadSetting",
  auth.photographer,
  collectionController.downloadSetting
);
router.put("/cover", collectionController.updateCover);
router.delete("/delete", auth.photographer, collectionController.delete);

module.exports = router;
