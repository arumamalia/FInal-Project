const path = require("path"); // to detect path of directory
const crypto = require("crypto"); // to encrypt something
const sharp = require("sharp");
// Import required AWS SDK clients and commands for Node.js
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");

// Set the AWS region
const REGION = process.env.S3_REGION; //e.g. "us-east-1"

// Set the parameters.
const uploadParams = (directory, filename, body, mimetype) => {
  return {
    ACL: "public-read",
    Bucket: process.env.S3_BUCKET,
    Key: `${directory}/${filename}`,
    Body: body,
    ContentType: mimetype,
  };
};

// Create Amazon S3 service client object.
const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

const run = async (directory, filename, body, mimetype) => {
  try {
    const data = await s3.send(
      new PutObjectCommand(uploadParams(directory, filename, body, mimetype))
    );

    return directory + "/" + filename;
  } catch (err) {
    console.log("Error", err);
  }
};

exports.uploadImage = async (files, directory, i) => {
  try {
    let image = [];
    let errors = [];

    let file;
    if (files.image.length > 1) {
      file = files.image[i];
    } else {
      file = files.image;
    }

    if (file) {
      // const file = req.files.image;

      // Make sure image is photo
      // if (!file.mimetype.startsWith("image")) {
      //   errors.push("File must be an image");
      // }

      // Check file size (max 1MB)
      // if (file.size > 10000000) {
      //   errors.push("Image must be less than 10MB");
      // }

      // If errors length > 0, it will make errors message
      // if (errors.length > 0) {
      //   // Because bad request
      //   return { error: true, message: errors.join(", "), statusCode: 400 };
      // }

      // Create custom filename
      let fileName = crypto.randomBytes(16).toString("hex");

      // Rename the file
      file.name = `${fileName}${path.parse(file.name).ext}`;
      file.nameCompress = `${fileName}-compress${path.parse(file.name).ext}`;

      // Upload original one
      // Upload image to /public/images
      image.push(
        await run(directory + "/original", file.name, file.data, file.mimetype)
      );

      // Upload compress image
      if (file.mimetype === "image/png") {
        file.dataCompress = await sharp(file.data)
          .rotate()
          .resize(512)
          .png()
          .toBuffer();
        file.mimetypeCompress = "image/png";
      } else {
        file.dataCompress = await sharp(file.data)
          .rotate()
          .resize(512)
          .jpeg({ mozjpeg: true })
          .toBuffer();
        file.mimetypeCompress = "image/jpeg";
      }

      image.push(
        await run(
          directory + "/compress",
          file.nameCompress,
          file.dataCompress,
          file.mimetypeCompress
        )
      );
    }
    // console.log("here");
    return image;
    // next();
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

exports.uplaodOneImage = async (files, directory, next) => {
  try {
    let image;
    let file = files.image;

    if (file) {
      // Create custom filename
      let fileName = crypto.randomBytes(16).toString("hex");

      // Rename the file
      file.name = `${fileName}${path.parse(file.name).ext}`;

      // Upload original one
      // Upload image to /public/images

      image = await run(directory, file.name, file.data, file.mimetype);
    }
    // console.log("here");
    return image;
    // next();
  } catch (e) {
    return next(e);
  }
};
exports.deleteImage = async (file) => {
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: file,
      })
    );
    console.log("success");
  } catch (error) {
    console.log(error);
  }
};
