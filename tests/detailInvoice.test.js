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
const { ResourceGroups } = require("aws-sdk");

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
  await collection.sync({ force: true });
  await collectionImages.sync({ force: true });
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
describe("/POST project", () => {
  it("it should create a project", async () => {
    const res = await request(app)
      .post("/project")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      })
      .send({
        title: "Wedding Sasuke",
        date: "2021/11/25",
        description: "jagongan",
        clientName: "Saske",
        clientAddress: "Adadeh",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Success");
  });
});
describe("/POST invoice", () => {
  it("it should create a package", async () => {
    const res = await request(app).post("/invoice?id_project=1").send({
      issuedDate: "2020/09/11",
      dueDate: "2020/10/11",
      isPaid: "true",
      paidCost: "50000",
      billToName: "Andre",
      billToAddress: "jonggol",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Success");
  });
});

describe("/POST detail invoice", () => {
  it("it should create a detail invoice", async () => {
    const res = await request(app).post("/detailInvoice?id_invoice=1").send({
      name: "Kamal",
      quantity: "1",
      price: "120000",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("create detail invoice");
  });
});

describe("/PUT deatil invoice", () => {
  it("it should edit a detail invoice", async () => {
    const res = await request(app).put("/detailInvoice?id_invoice=1").send({
      name: "Kamal",
      quantity: "1",
      price: "120000",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("update detail invoice");
  });
});

describe("/GET detail invoice", () => {
  it("it should GET all the detail invoice", async () => {
    const res = await request(app).get("/detailInvoice");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Get all detailInvoice");
  });
});

describe("/GET detail invoice", () => {
  it("it should GET ONE detail invoice", async () => {
    const res = await request(app).get("/detailInvoice/one?id_detailInvoice=1");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("get one detail invoice");
  });
});

// describe("/POST detail invoice", () => {
//   it("it should add package", async () => {
//     const res = await request(app).post("/detailInvoice/");

//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toBeInstanceOf(Object);
//     expect(res.body).toHaveProperty("message");
//     expect(res.body.message).toEqual("Success");
//   });
// });

describe("/GET detail invoice", () => {
  it("it should error get one detail invoice", async () => {
    const res = await request(app).get("/detailInvoice/one?id_detailInvoice=9");

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("detail invoice not found");
  });
});
//=================================================

describe("/POST detail invoice", () => {
  it("it should create a detail invoice", async () => {
    const res = await request(app).post("/detailInvoice?id_invoice=1").send({
      name: "Kamal",
      quantity: "1",
      // price: "120000",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("price must be fill");
  });
});

describe("/POST detail invoice", () => {
  it("it should create a detail invoice", async () => {
    const res = await request(app).post("/detailInvoice?id_invoice=1").send({
      name: "Kamal",
      quantity: "1a",
      price: "120000",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Quantity must be integer");
  });
});

describe("/POST detail invoice", () => {
  it("it should create a detail invoice", async () => {
    const res = await request(app).post("/detailInvoice?id_invoice=1").send({
      // name: "Kamal",
      quantity: "1",
      price: "120000",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("name must be fill");
  });
});
describe("/POST detail invoice", () => {
  it("it should create a detail invoice", async () => {
    const res = await request(app).post("/detailInvoice?id_invoice=1").send({
      name: "Kamal",
      // quantity: "1",
      price: "120000",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("quantity must be fill");
  });
});
describe("/POST detail invoice", () => {
  it("it should create a detail invoice", async () => {
    const res = await request(app).post("/detailInvoice?id_invoice=1").send({
      name: "Kamal",
      quantity: "1",
      price: "1a20000",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("price must be integer");
  });
});
//=================================================
describe("/PUT deatil invoice", () => {
  it("it should edit a detail invoice", async () => {
    const res = await request(app).put("/detailInvoice?id_invoice=1").send({
      name: "Kamal",
      quantity: "1",
      price: "1200a00",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("price must be integer");
  });
});
describe("/PUT deatil invoice", () => {
  it("it should edit a detail invoice", async () => {
    const res = await request(app).put("/detailInvoice?id_invoice=1").send({
      name: "Kamal",
      quantity: "1a",
      price: "120000",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Quantity must be integer");
  });
});

describe("/PUT deatil invoice", () => {
  it("it should edit a detail invoice", async () => {
    const res = await request(app).put("/detailInvoice?id_invoice=1").send({
      // name: "Kamal",
      quantity: "1",
      price: "120000",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("name must be fill");
  });
});
describe("/PUT deatil invoice", () => {
  it("it should edit a detail invoice", async () => {
    const res = await request(app).put("/detailInvoice?id_invoice=1").send({
      name: "Kamal",
      quantity: "1",
      // price: "120000",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("price must be fill");
  });
});
describe("/PUT deatil invoice", () => {
  it("it should edit a detail invoice", async () => {
    const res = await request(app).put("/detailInvoice?id_invoice=1").send({
      name: "Kamal",
      // quantity: "1",
      price: "120000",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("quantity must be fill");
  });
});

//=================================================

describe("/DELETE detail Invoice", () => {
  it("it should DELETE eror invoice", async () => {
    const res = await request(app).delete(
      "/detailInvoice/delete?id_detailInvoice=100"
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("detailInvoice not found");
  });
});
describe("/DELETE detail invoice", () => {
  it("it should DELETE invoice", async () => {
    const res = await request(app).delete(
      "/detailInvoice/delete?id_detailInvoice=1"
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Success delete detailInvoice");
  });
});
