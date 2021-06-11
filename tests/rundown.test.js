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

  describe("/POST rundown", () => {
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
    it("it should create a rundown", async () => {
      const res = await request(app)
        .post("/rundown")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_project: "1",
          person: "naruto",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Success");
    });
  });
  describe("/PUT rundown", () => {
    it("it should edit a rundown", async () => {
      const res = await request(app)
        .put("/rundown?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_project: "1",
          person: "sasuke",
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Success");
    });
  });

  describe("/GET rundown", () => {
    it("it should GET all the rundown", async () => {
      const res = await request(app)
        .get("/rundown")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Success");
    });
  });
  describe("/GET rundown", () => {
    it("it should GET ONE rundown", async () => {
      const res = await request(app)
        .get("/rundown/one?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Success");
    });
  });

  //==================================================================================================

  describe("/POST rundown validator", () => {
    it("it should error project not found", async () => {
      const res = await request(app)
        .post("/rundown")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_project: "10",
          person: "naruto",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Project Not Found");
    });
  });
  describe("/POST rundown validator", () => {
    it("it should error person name must be fill", async () => {
      const res = await request(app)
        .post("/rundown")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_project: "1",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("person name must be fill");
    });
  });
  describe("/PUT rundown validator", () => {
    it("it should error rundown not found", async () => {
      const res = await request(app)
        .put("/rundown?id=5")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_project: "1",
          person: "naruto",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Rundown Not Found");
    });
  });
  describe("/PUT rundown validator", () => {
    it("it should error project not found", async () => {
      const res = await request(app)
        .put("/rundown?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_project: "10",
          person: "naruto",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Project Not Found");
    });
  });
  describe("/PUT rundown validator", () => {
    it("it should error person name must be fill", async () => {
      const res = await request(app)
        .put("/rundown?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_project: "1",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("person name must be fill");
    });
  });
  //==================================================================================================
  // describe("/GET rundown validator", () => {
  //   it("it should GET ONE rundown", async () => {
  //     const res = await request(app)
  //       .get("/rundown/one?id=10")
  //       .set({
  //         Authorization: `Bearer ${authenticationToken}`,
  //       });

  //     expect(res.statusCode).toEqual(400);
  //     expect(res.body).toBeInstanceOf(Object);
  //     expect(res.body).toHaveProperty("message");
  //     expect(res.body.message).toEqual("Rundown Not Found");
  //   });
  // });
  //==================================================================================================
  describe("/DELETE rundown", () => {
    it("it should error delete rundown", async () => {
      const res = await request(app)
        .delete("/rundown/delete?id=5")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Data Not Found");
    });
  });
  describe("/DELETE rundown", () => {
    it("it should delete rundown", async () => {
      const res = await request(app)
        .delete("/rundown/delete?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Success Delete Rundown");
    });
  });
});
