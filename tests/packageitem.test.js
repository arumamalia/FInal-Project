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
  // await collectionMeta.sync({ force: true });
  await event.sync({ force: true });
  await invoice.sync({ force: true });
  await detailInvoice.sync({ force: true });
  await packageItem.sync({ force: true });
  await category.sync({ force: true });
  await rundown.sync({ force: true });
  await project.sync({ force: true });
  await packager.sync({ force: true });
  // await collectionMeta.sync({ force: true });
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
describe("/POST packageItem", () => {
  it("it should create a packageItem", async () => {
    const res = await request(app).post("/packageItem").send({
      packageId: "1",
      itemName: "kamal",
      price: "12",
      id_category: "1",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("created package item");
  });
});
describe("/PUT packageItem", () => {
  it("it should edit a packageItem", async () => {
    const res = await request(app)
      .put("/packageItem")

      .send({
        itemName: "indorr",
        price: "1000",
        packageId: "1",
        packageItemId: "1",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("updated package");
  });
});
describe("/PUT packageItem", () => {
  it("it should edit a packageItem", async () => {
    const res = await request(app)
      .put("/packageItem")

      .send({
        packageId: "1",
        packageItemId: "1",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("update with empty item");
  });
});

describe("/GET packageItem", () => {
  it("it should GET all the packageItem", async () => {
    const res = await request(app).get("/packageItem");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Get all package item");
  });
});

describe("/GET packageItem", () => {
  it("it should GET one the packageItem", async () => {
    const res = await request(app).get("/packageItem/one?packageItemId=1");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Get One package item");
  });
});

describe("/GET packageItem", () => {
  it("it should GET one the packageItem", async () => {
    const res = await request(app).get("/packageItem/byPackage?packageId=1");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Get package item by package id");
  });
});
//===============================================
describe("/POST packageItem", () => {
  it("it should create error packageItem", async () => {
    const res = await request(app).post("/packageItem").send({
      // packageId: "1",
      // itemName: "kamal",
      price: "12",
      id_category: "1",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("item name must be fill");
  });
});

describe("/POST packageItem", () => {
  it("it should create error packageItem", async () => {
    const res = await request(app).post("/packageItem").send({
      // packageId: "1",
      itemName: "kamal",
      price: "12a",
      id_category: "1",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("price must be integer");
  });
});
describe("/POST packageItem", () => {
  it("it should create error packageItem", async () => {
    const res = await request(app).post("/packageItem").send({
      // packageId: "1",
      itemName: "kamal",
      //   price: "12a",
      id_category: "1",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("price must be fill");
  });
});
describe("/PUT packageItem", () => {
  it("it should create error packageItem", async () => {
    const res = await request(app).post("/packageItem/").send({
      packageId: "1",
      packageItemId: "1",
      // itemName: "kamal",
      price: "12",
      // id_category: "1",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("item name must be fill");
  });
});

describe("/POST packageItem", () => {
  it("it should create error packageItem", async () => {
    const res = await request(app).post("/packageItem").send({
      packageId: "1",
      packageItemId: "1",
      itemName: "kamal",
      price: "12a",
      //   id_category: "1",
      packageItemId: "1",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("price must be integer");
  });
});
describe("/POST packageItem", () => {
  it("it should create error packageItem", async () => {
    const res = await request(app).post("/packageItem").send({
      packageId: "1",
      itemName: "kamal",
      //   price: "12a",
      //   id_category: "1",
      packageItemId: "1",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("price must be fill");
  });
});

describe("/GET packageItem", () => {
  it("it should GET one error packageItem", async () => {
    const res = await request(app).get("/packageItem/byPackage?packageId=10");

    expect(res.statusCode).toEqual(404);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("package not found");
  });
});

describe("/DELETE packageItem", () => {
  it("it should DELETE eror invoice", async () => {
    const res = await request(app).delete(
      "/packageItem/delete?packageItemId=1000"
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Package item not found");
  });
});
// describe("/DELETE packageItem", () => {
//   it("it should DELETE pakcage item", async () => {
//     const res = await request(app).delete(
//       "/packageItem/delete?packageItemId=1"
//     );

//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toBeInstanceOf(Object);
//     expect(res.body).toHaveProperty("message");
//     expect(res.body.message).toEqual("Success delete pakcage item");
//   });
// });
