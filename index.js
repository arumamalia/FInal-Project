require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

// Express
const express = require("express");

const app = express();
const fs = require("fs");
const fileUpload = require("express-fileupload");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./middlewares/errorHandler");

const authRoutes = require("./routes/authRoutes");

const invoiceRoutes = require("./routes/invoiceRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const packagerRoutes = require("./routes/packagerRoutes");
const rundownRoutes = require("./routes/rundownRoutes");
const packageItemRoutes = require("./routes/packageItemRoutes");
const detailInvoiceRoutes = require("./routes/detailInvoiceRoutes");
const eventRoutes = require("./routes/eventRoutes");

// Import routes
const collectionRoutes = require("./routes/collectionRoutes");
const collectionImagesRoutes = require("./routes/collectionImagesRoutes");

//Set body parser for HTTP post operation
app.use(express.json()); // support json encoded bodies
app.use(
  express.urlencoded({
    extended: true,
  })
); // support en<<<<<<<coded bodies

//to read form-data
app.use(fileUpload());

// set static assets to public directory (usually for images, videos, and other files)
app.use(express.static("public"));

// Sanitize data
app.use(mongoSanitize());

// Prevent XSS attact
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 mins
  max: 100,
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Use helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// CORS
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  // create a write stream (in append mode)
  let accessLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    {
      flags: "a",
    }
  );

  // setup the logger
  app.use(morgan("combined", { stream: accessLogStream }));
}

// Import table relationship
require("./utils/associations");

app.use("/user", userRoutes);
app.use("/project", projectRoutes);
app.use("/package", packagerRoutes);
app.use("/rundown", rundownRoutes);
app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/invoice", invoiceRoutes);
app.use("/packageItem", packageItemRoutes);
app.use("/collection", collectionRoutes);
app.use("/collectionImages", collectionImagesRoutes);
app.use("/detailInvoice", detailInvoiceRoutes);
app.use("/event", eventRoutes);

app.use(errorHandler);
// Server running
if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => console.log("This server running on 3000"));
}

module.exports = app;
