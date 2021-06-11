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

  describe("/POST event", () => {
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
    it("it should create a event", async () => {
      const res = await request(app)
        .post("/event")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_rundown: "1",
          name: "makan pagi",
          from: "08:00",
          to: "09:00",
          description: "makan pagi bersama sama",
          theme: "merah",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Success");
    });
  });
  describe("/PUT event", () => {
    it("it should edit a event", async () => {
      const res = await request(app)
        .put("/event?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_rundown: "1",
          name: "makan siang",
          from: "12:00",
          to: "13:00",
          description: "makan siang bersama sama",
          theme: "biru",
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Success");
    });
  });

  describe("/GET event", () => {
    it("it should GET all the event", async () => {
      const res = await request(app)
        .get("/event")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Success");
    });
  });
  describe("/GET event", () => {
    it("it should GET ONE event", async () => {
      const res = await request(app)
        .get("/event/one?id=1")
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

  describe("/POST event validator", () => {
    it("it should error Rundown Not Found", async () => {
      const res = await request(app)
        .post("/event")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_rundown: "10",
          name: "makan siang",
          from: "12:00",
          to: "13:00",
          description: "makan siang bersama sama",
          theme: "biru",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Rundown Not Found");
    });
  });
  describe("/POST event validator", () => {
    it("it should error description must be fill", async () => {
      const res = await request(app)
        .post("/event")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_rundown: "1",
          name: "makan siang",
          from: "12:00",
          to: "13:00",
          theme: "biru",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("description must be fill");
    });
  });
  describe("/POST event validator", () => {
    it("it should error theme must be fill", async () => {
      const res = await request(app)
        .post("/event")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_rundown: "1",
          name: "makan siang",
          from: "12:00",
          to: "13:00",
          description: "makan siang bersama sama",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("theme must be fill");
    });
  });
  describe("/POST event validator", () => {
    it("it should error to: invalid time format (HH:MM)", async () => {
      const res = await request(app)
        .post("/event")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_rundown: "1",
          name: "makan siang",
          from: "12:00",
          to: "13:0000",
          description: "makan siang bersama sama",
          theme: "biru",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("to: invalid time format (HH:MM)");
    });
  });
  describe("/POST event validator", () => {
    it("it should error from: invalid time format (HH:MM)", async () => {
      const res = await request(app)
        .post("/event")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_rundown: "1",
          name: "makan siang",
          from: "12:000",
          to: "13:00",
          description: "makan siang bersama sama",
          theme: "biru",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("from: invalid time format (HH:MM)");
    });
  });
  describe("/POST event validator", () => {
    it("it should error from and to must be fill", async () => {
      const res = await request(app)
        .post("/event")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_rundown: "1",
          name: "makan siang",

          to: "13:00",
          description: "makan siang bersama sama",
          theme: "biru",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("from and to must be fill");
    });
  });
  describe("/POST event validator", () => {
    it("it should error name must be fill", async () => {
      const res = await request(app)
        .post("/event")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_rundown: "1",
          from: "12:00",
          to: "13:00",
          description: "makan siang bersama sama",
          theme: "biru",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("name must be fill");
    });
  });
  //==================================================================================================

  describe("/PUT event validator", () => {
    it("it should error Event Not Found", async () => {
      const res = await request(app)
        .put("/event?id=10")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_rundown: "1",
          name: "makan siang",
          from: "12:00",
          to: "13:00",
          description: "makan siang bersama sama",
          theme: "biru",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Event Not Found");
    });
  });
  describe("/PUT event validator", () => {
    it("it should error description must be fill", async () => {
      const res = await request(app)
        .put("/event?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_rundown: "1",
          name: "makan siang",
          from: "12:00",
          to: "13:00",
          theme: "biru",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("description must be fill");
    });
  });
  describe("/PUT event validator", () => {
    it("it should error theme must be fill", async () => {
      const res = await request(app)
        .put("/event?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_rundown: "1",
          name: "makan siang",
          from: "12:00",
          to: "13:00",
          description: "makan siang bersama sama",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("theme must be fill");
    });
  });
  describe("/PUT event validator", () => {
    it("it should error to: invalid time format (HH:MM)", async () => {
      const res = await request(app)
        .put("/event?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_rundown: "1",
          name: "makan siang",
          from: "12:00",
          to: "13:0000",
          description: "makan siang bersama sama",
          theme: "biru",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("to: invalid time format (HH:MM)");
    });
  });
  describe("/PUT event validator", () => {
    it("it should error from: invalid time format (HH:MM)", async () => {
      const res = await request(app)
        .put("/event?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_rundown: "1",
          name: "makan siang",
          from: "12:000",
          to: "13:00",
          description: "makan siang bersama sama",
          theme: "biru",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("from: invalid time format (HH:MM)");
    });
  });
  describe("/PUT event validator", () => {
    it("it should error from and to must be fill", async () => {
      const res = await request(app)
        .put("/event?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_rundown: "1",
          name: "makan siang",

          to: "13:00",
          description: "makan siang bersama sama",
          theme: "biru",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("from and to must be fill");
    });
  });
  describe("/PUT event validator", () => {
    it("it should error name must be fill", async () => {
      const res = await request(app)
        .put("/event?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          id_rundown: "1",
          from: "12:00",
          to: "13:00",
          description: "makan siang bersama sama",
          theme: "biru",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("name must be fill");
    });
  });
  //==================================================================================================
  describe("/GET event validator", () => {
    it("it should GET ONE event", async () => {
      const res = await request(app)
        .get("/event/one?id=10")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Event Not Found");
    });
  });
  //==================================================================================================
  describe("/DELETE event", () => {
    it("it should error delete event", async () => {
      const res = await request(app)
        .delete("/event/delete?id=5")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Data Not Found");
    });
  });
  describe("/DELETE event", () => {
    it("it should delete event", async () => {
      const res = await request(app)
        .delete("/event/delete?id=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Success Delete Event");
    });
  });
});
