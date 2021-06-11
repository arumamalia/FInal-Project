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
  describe("/PUT project", () => {
    it("it should edit a project", async () => {
      const res = await request(app)
        .put("/project?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          title: "Wedding Sasuke",
          date: "2021/11/25",
          description: "nikahan",
          clientName: "Saske",
          clientAddress: "Adadeh",
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Success");
    });
  });
  describe("/PUT project", () => {
    it("it should add package", async () => {
      const res = await request(app)
        .put("/project/addPackage?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_package: "1",
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Success");
    });
  });

  describe("/GET project", () => {
    it("it should GET all the project", async () => {
      const res = await request(app)
        .get("/project")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Success");
    });
  });
  describe("/GET project", () => {
    it("it should GET ONE project", async () => {
      const res = await request(app)
        .get("/project/one?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Success");
    });
  });

  describe("/GET project", () => {
    it("it should search a project", async () => {
      const res = await request(app)
        .get("/project/search?title=sasuke")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Success");
    });
  });
  describe("/GET project", () => {
    it("it should filter project", async () => {
      const res = await request(app)
        .get("/project/filter?isCompleted=0")
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
  describe("/POST project validator", () => {
    it("it should error title must be fill", async () => {
      const res = await request(app)
        .post("/project")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          date: "2021/11/25",
          description: "jagongan",
          clientName: "Saske",
          clientAddress: "Adadeh",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("title name must be fill");
    });
  });
  describe("/POST project validator", () => {
    it("it should error invalid date format", async () => {
      const res = await request(app)
        .post("/project")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          title: "Wedding Sasuke",
          date: "25/11/2255",
          description: "jagongan",
          clientName: "Saske",
          clientAddress: "Adadeh",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("invalid date format (YYYY/MM/DD)");
    });
  });
  describe("/POST project validator", () => {
    it("it should error client name must be fill", async () => {
      const res = await request(app)
        .post("/project")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          title: "Wedding Sasuke",
          date: "2021/11/25",
          description: "jagongan",

          clientAddress: "Adadeh",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("client name must be fill");
    });
  });
  describe("/POST project validator", () => {
    it("it should error client address must be fill", async () => {
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
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("client address must be fill");
    });
  });
  //===================================================================================================
  describe("/PUT project validator", () => {
    it("it should project not found", async () => {
      const res = await request(app)
        .put("/project?id=5")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          title: "nikahan",
          date: "2021/11/25",
          description: "jagongan",
          clientName: "Saske",
          clientAddress: "Adadeh",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Project Not Found");
    });
  });
  describe("/PUT project validator", () => {
    it("it should error title must be fill", async () => {
      const res = await request(app)
        .put("/project?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          date: "2021/11/25",
          description: "jagongan",
          clientName: "Saske",
          clientAddress: "Adadeh",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("title name must be fill");
    });
  });
  describe("/PUT project validator", () => {
    it("it should error invalid date format", async () => {
      const res = await request(app)
        .put("/project?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          title: "Wedding Sasuke",
          date: "25/11/2255",
          description: "jagongan",
          clientName: "Saske",
          clientAddress: "Adadeh",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("invalid date format (YYYY/MM/DD)");
    });
  });
  describe("/PUT project validator", () => {
    it("it should error client name must be fill", async () => {
      const res = await request(app)
        .put("/project?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          title: "Wedding Sasuke",
          date: "2021/11/25",
          description: "jagongan",

          clientAddress: "Adadeh",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("client name must be fill");
    });
  });
  describe("/PUT project validator", () => {
    it("it should error client address must be fill", async () => {
      const res = await request(app)
        .put("/project?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          title: "Wedding Sasuke",
          date: "2021/11/25",
          description: "jagongan",
          clientName: "Saske",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("client address must be fill");
    });
  });
  //===================================================================================================
  describe("/GET project validator", () => {
    it("it should error get one project", async () => {
      const res = await request(app)
        .get("/project/one?id=5")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Project Not Found");
    });
  });
  //===================================================================================================
  describe("/DELETE project", () => {
    it("it should error delete project", async () => {
      const res = await request(app)
        .delete("/project/delete?id=5")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Data Not Found");
    });
  });
  describe("/DELETE project", () => {
    it("it should delete project", async () => {
      const res = await request(app)
        .delete("/project/delete?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Success Delete Project");
    });
  });
});
