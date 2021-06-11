const {
  collection,
  collectionImages,
  user,
  collectionMeta,
} = require("../models");
// AWS S3 Zip
const fs = require("fs");
const join = require("path").join;
const AWS = require("aws-sdk");
const s3Zip = require("s3-zip");
const XmlStream = require("xml-stream");

class DownloadController {
  async download(req, res) {
    const region = process.env.S3_REGION;
    const bucket = process.env.S3_BUCKET;
    const folder = `collectionImage/${req.params.id}/${req.params.type}`;
    const s3 = new AWS.S3({
      signatureVersion: "v4",
      s3ForcePathStyle: "true",
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    });
    const params = {
      Bucket: bucket,
      Prefix: folder,
    };

    const filesArray = [];
    const files = s3.listObjects(params).createReadStream();
    const xml = new XmlStream(files);
    xml.collect("Key");
    xml.on("endElement: Key", function (item) {
      filesArray.push(item["$text"].substr(folder.length));
    });

    xml.on("end", function () {
      zip(filesArray);
    });

    function zip(files) {
      res.set("content-type", "application/zip");
      res.set(
        "Content-Disposition",
        `attachment; filename=${req.params.id}-${req.params.type}.zip`
      );
      s3Zip
        .archive(
          {
            s3: s3,
            region: region,
            bucket: bucket,
            preserveFolderStructure: false,
          },
          folder,
          files
        )
        .pipe(res);
    }
  }

  async downloadCollection(req, res) {
    const region = process.env.S3_REGION;
    const bucket = process.env.S3_BUCKET;
    const folder = `collectionImage/${req.params.id}/${req.params.type}`;
    const s3 = new AWS.S3({
      signatureVersion: "v4",
      s3ForcePathStyle: "true",
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    });
    const params = {
      Bucket: bucket,
      Prefix: folder,
    };

    const filesArray = [];
    const files = s3.listObjects(params).createReadStream();
    const xml = new XmlStream(files);
    xml.collect("Key");
    xml.on("endElement: Key", function (item) {
      filesArray.push(item["$text"].substr(folder.length));
    });

    xml.on("end", function () {
      zip(filesArray);
    });

    function zip(files) {
      res.set("content-type", "application/zip");
      res.set(
        "Content-Disposition",
        `attachment; filename=${req.params.id}-${req.params.type}.zip`
      );
      s3Zip
        .archive(
          {
            s3: s3,
            region: region,
            bucket: bucket,
            preserveFolderStructure: false,
          },
          folder,
          files
        )
        .pipe(res);
    }
  }

  async middlewareDownload(req, res, next) {
    try {
      let data = await collection.findOne({
        where: { id: req.params.id },
      });
      console.log(data.totalDownload);
      let newLimit = data.limit - 1;
      let newTotal = data.totalDownload + 1;
      if (data.limit == 0) {
        return res.status(200).json({
          message: "cannot download collection",
          success: true,
        });
      } else {
        let update = {
          limit: newLimit,
          totalDownload: newTotal,
        };
        let updateData = await collection.update(update, {
          where: { id: req.params.id },
        });
        next();
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new DownloadController();
