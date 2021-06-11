const request = require("supertest");
const app = require("../index");
const {
  user,
  project,
  packager,
  collection,
  collectionImages,

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
describe("/POST package", () => {
  it("it should create a package", async () => {
    const res = await request(app)
      .post("/package")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      })
      .send({
        name: "kamal",
        description: "description",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("created package");
  });
});
describe("/PUT package", () => {
  it("it should edit a package", async () => {
    const res = await request(app)
      .put("/package")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      })
      .send({
        name: "kamal",
        description: "description",
        packageId: "1",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("updated package");
  });
});

describe("/GET package", () => {
  it("it should GET all the package", async () => {
    const res = await request(app)
      .get("/package")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Get all package");
  });
});

describe("/GET package", () => {
  it("it should GET one the package", async () => {
    const res = await request(app)
      .get("/package/one?packageId=1")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Get One package");
  });
});

describe("/GET package", () => {
  it("it should GET all client", async () => {
    const res = await request(app).get("/package/allPackage");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Get all package");
  });
});

describe("/GET package", () => {
  it("it should GET search package", async () => {
    const res = await request(app)
      .get("/package/search?name=kamal")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Get all package by search");
  });
});

describe("/GET package", () => {
  it("it should GET filter package", async () => {
    const res = await request(app)
      .get("/package/filter?category_1=Photo Session")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Get all package");
  });
});
// //==================================================================================================
describe("/POST package validator", () => {
  it("it should validate name create a package", async () => {
    const res = await request(app)
      .post("/package")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      })
      .send({
        description: "description",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Name must be fill");
  });
});
describe("/POST Validate package", () => {
  it("it should validate description create a package", async () => {
    const res = await request(app)
      .post("/package")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      })
      .send({
        name: "kamal",
        packageId: "1",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Description must be fill");
  });
});
describe("/PUT package validator", () => {
  it("it should validate name update a package", async () => {
    const res = await request(app)
      .put("/package")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      })
      .send({
        description: "description",
        packageId: "1",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Name must be fill");
  });
});
describe("/PUT Validate package", () => {
  it("it should validate description update a package", async () => {
    const res = await request(app)
      .put("/package")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      })
      .send({
        name: "kamal",
        packageId: "1",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Description must be fill");
  });
});
describe("/PUT package", () => {
  it("it should validate id_package", async () => {
    const res = await request(app)
      .put("/package")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      })
      .send({
        name: "kamal",
        description: "description",
        packageId: "10",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Package not found");
  });
});
describe("/GET validate package", () => {
  it("it should GET validate one the package", async () => {
    const res = await request(app)
      .get("/package/one?packageId=1000")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Package not found");
  });
});
