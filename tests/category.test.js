const request = require("supertest");
const app = require("../index");
const {
  user,
  project,
  packager,
  collection,
  collectionImages,
  collectionMeta,
  invoice,
  detailInvoice,
  rundown,
  category,
  packageItem,
  event,
} = require("../models");
const sequelize = require("sequelize");

let authenticationToken;
beforeAll(async () => {
  await invoice.sequelize.query("SET FOREIGN_KEY_CHECKS = 0", { raw: true });
  await event.sync({ force: true });
  await invoice.sync({ force: true });
  await detailInvoice.sync({ force: true });
  await packageItem.sync({ force: true });
  await category.sync({ force: true });
  await rundown.sync({ force: true });
  await project.sync({ force: true });
  await packager.sync({ force: true });
  await collectionImages.sync({ force: true });
  await collection.sync({ force: true });
  await user.sync({ force: true });
});

describe("/signup POST", () => {
  it("It should make user and get the token", async () => {
    const res = await request(app).post("/auth/signup").send({
      email: "rioyanuar90@gmail.com",
      password: "Riko1234!!",
      confirmPassword: "Riko1234!!",
      name: "Riko Yanuar",
      businessName: "Riko studio",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual("success");
    expect(res.body).toHaveProperty("token");
  });
});
describe("/signin POST", () => {
  it("It should make user login and get authentication_key (jwt)", async () => {
    const res = await request(app).post("/auth/signin").send({
      email: "rioyanuar90@gmail.com",
      password: "Riko1234!!",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual("success");
    expect(res.body).toHaveProperty("token");

    authenticationToken = res.body.token;
  });
});
describe("/POST category", () => {
  it("it should create a category", async () => {
    const res = await request(app).post("/category").send({
      name: "Photo Session",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Success");
  });
});
describe("/PUT category", () => {
  it("it should edit a category", async () => {
    const res = await request(app).put("/category").send({
      name: "Photo Session",
      categoryId: "1",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Success");
  });
});

describe("/GET category", () => {
  it("it should GET all category", async () => {
    const res = await request(app).get("/category");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Get all category");
  });
});

describe("/GET category", () => {
  it("it should GET one category", async () => {
    const res = await request(app).get("/category/one?categoryId=1");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Success");
  });
});

// //==================================================================================================

describe("/POST validate category", () => {
  it("it should create a category", async () => {
    const res = await request(app).post("/category").send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("category must be fill");
  });
});
describe("/PUT validate category", () => {
  it("it should edit a category", async () => {
    const res = await request(app).put("/category").send({
      name: "Photo Session",
      categoryId: "a",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Category not found");
  });
});
describe("/PUT validate category", () => {
  it("it should edit a category", async () => {
    const res = await request(app).put("/category").send({
      categoryId: "1",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("category must be fill");
  });
});
describe("/GET validate category", () => {
  it("it should GET one category", async () => {
    const res = await request(app).get("/category/one?categoryId=10000");

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("category not found");
  });
});
//===========================================================================================
describe("/DELETE category", () => {
  it("it should error delete category", async () => {
    const res = await request(app).delete("/category/delete?categoryId=50");

    expect(res.statusCode).toEqual(404);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Category not found");
  });
});
describe("/DELETE category", () => {
  it("it should delete pcateogyr", async () => {
    const res = await request(app).delete("/category/delete?categoryId=1");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Success delete category");
  });
});
