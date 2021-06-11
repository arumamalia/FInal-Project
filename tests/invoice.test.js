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
describe("/PUT invoice", () => {
  it("it should edit a invoice", async () => {
    const res = await request(app)
      .put("/invoice?id_project=1&id_invoice=1")
      .send({
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
    expect(res.body.message).toEqual("update detail invoice");
  });
});

describe("/GET invoice", () => {
  it("it should GET all invoice", async () => {
    const res = await request(app).get("/invoice?id_project=1");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Get all invoice");
  });
});

describe("/GET invoice", () => {
  it("it should GET one the invoice", async () => {
    const res = await request(app).get("/invoice/one?id_invoice=1");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Success");
  });
});

//==================================================================================================
describe("/POST invoice", () => {
  it("it should error create a package", async () => {
    const res = await request(app).post("/invoice?id_project=1").send({
      issuedDate: "2020/09/11",
      dueDate: "2020/10/11",
      isPaid: "gagal",
      paidCost: "5000",
      billToName: "Andre",
      billToAddress: "jonggol",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Paid status must be boolean");
  });
});
describe("/POST invoice", () => {
  it("it should error create a package", async () => {
    const res = await request(app).post("/invoice?id_project=1").send({
      issuedDate: "20/20/0911",
      dueDate: "2020/10/11",
      isPaid: "true",
      paidCost: "50000",
      billToName: "Andre",
      billToAddress: "jonggol",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("invalid issuedDate format (YYYY/MM/DD)");
  });
});

describe("/POST invoice", () => {
  it("it should error create a package", async () => {
    const res = await request(app).post("/invoice?id_project=1").send({
      issuedDate: "2020/09/11",
      dueDate: "20/20/1011",
      isPaid: "true",
      paidCost: "50000",
      billToName: "Andre",
      billToAddress: "jonggol",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("invalid dueDate format (YYYY/MM/DD)");
  });
});

describe("/POST invoice", () => {
  it("it should create a package", async () => {
    const res = await request(app).post("/invoice?id_project=5").send({
      issuedDate: "2020/09/11",
      dueDate: "2020/10/11",
      isPaid: "true",
      paidCost: "50000",
      billToName: "Andre",
      billToAddress: "jonggol",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Project not found");
  });
});
//=========================================================
describe("/PUT invoice", () => {
  it("it should error update a package", async () => {
    const res = await request(app)
      .put("/invoice?id_project=1&id_invoice=1")
      .send({
        issuedDate: "2020/09/11",
        dueDate: "2020/10/11",
        isPaid: "gagal",
        paidCost: "5000",
        billToName: "Andre",
        billToAddress: "jonggol",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Paid status must be boolean");
  });
});
describe("/POST invoice", () => {
  it("it should error update a package", async () => {
    const res = await request(app)
      .put("/invoice?id_project=1&id_invoice=1")
      .send({
        issuedDate: "20/20/0911",
        dueDate: "2020/10/11",
        isPaid: "true",
        paidCost: "50000",
        billToName: "Andre",
        billToAddress: "jonggol",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("invalid issuedDate format (YYYY/MM/DD)");
  });
});

describe("/POST invoice", () => {
  it("it should error update a package", async () => {
    const res = await request(app)
      .put("/invoice?id_project=1&id_invoice=1")
      .send({
        issuedDate: "2020/09/11",
        dueDate: "20/20/1011",
        isPaid: "true",
        paidCost: "50000",
        billToName: "Andre",
        billToAddress: "jonggol",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("invalid dueDate format (YYYY/MM/DD)");
  });
});

describe("/POST invoice", () => {
  it("it should update a package", async () => {
    const res = await request(app)
      .put("/invoice?id_project=5&id_invoice=1")
      .send({
        issuedDate: "2020/09/11",
        dueDate: "2020/10/11",
        isPaid: "true",
        paidCost: "50000",
        billToName: "Andre",
        billToAddress: "jonggol",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Project item not found");
  });
});
describe("/PUT invoice", () => {
  it("it should error a invoice", async () => {
    const res = await request(app)
      .put("/invoice?id_project=1&id_invoice=1")
      .send({
        issuedDate: "2020/09/11",
        dueDate: "2020/10/11",
        //   isPaid: "true",
        paidCost: "50000",
        billToName: "Andre",
        billToAddress: "jonggol",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Paid status must be fill");
  });
});
describe("/PUT invoice", () => {
  it("it should error a invoice", async () => {
    const res = await request(app)
      .put("/invoice?id_project=1&id_invoice=1")
      .send({
        issuedDate: "2020/09/11",
        dueDate: "2020/10/11",
        isPaid: "true",
        //   paidCost: "50000",
        billToName: "Andre",
        billToAddress: "jonggol",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Paid cost must be fill");
  });
});
describe("/GET invoice", () => {
  it("it should GET one error invoice", async () => {
    const res = await request(app).get("/invoice/one?id_invoice=100");

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("invoice not found");
  });
});
describe("/DELETE invoice", () => {
  it("it should DELETE eror invoice", async () => {
    const res = await request(app).delete("/invoice/delete?id_invoice=100");

    expect(res.statusCode).toEqual(404);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("invoice not found");
  });
});
describe("/DELETE invoice", () => {
  it("it should DELETE invoice", async () => {
    const res = await request(app).delete("/invoice/delete?id_invoice=1");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Success delete invoice");
  });
});
