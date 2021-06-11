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
  await collectionImages.sync({ force: true });
  await collection.sync({ force: true });
  await user.sync({ force: true });
});

describe("/signup POST", () => {
  it("It should make user and get the token", async () => {
    const res = await request(app).post("/auth/signup").send({
      email: "liaa@gmail.com",
      password: "!1234Abcd",
      confirmPassword: "!1234Abcd",
      name: "Arum Amalia",
      businessName: "La Belle Sauvage",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual("success");
    expect(res.body).toHaveProperty("token");
  });

  describe("/signin POST", () => {
    it("It should make user login and get authentication_key (jwt)", async () => {
      const res = await request(app).post("/auth/signin").send({
        email: "liaa@gmail.com",
        password: "!1234Abcd",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("success");
      expect(res.body).toHaveProperty("token");

      authenticationToken = res.body.token;
    });
  });

  // describe("/POST collection", () => {
  //   it("it should create a collection", async () => {
  //     const res = await request(app)
  //       .post("/collection")
  //       .set({
  //         Authorization: `Bearer ${authenticationToken}`,
  //       })
  //       .send({
  //         title: "Wedding",
  //         description: "abadikan momen berhargamu",
  //         date: "2021/01/01",
  //         theme: "Classic",
  //         showGallery: "true",
  //         downloadOption: "true",
  //       });
  //     console.log(res)

  //     expect(res.statusCode).toEqual(200);
  //     expect(res.body).toBeInstanceOf(Object);
  //     expect(res.body).toHaveProperty("message");
  //     expect(res.body.message).toEqual("Success");
  //   });
  // });

  // describe("/PUT collection", () => {
  //   it("it should edit a collection", async () => {
  //     const res = await request(app)
  //       .put("/collection?id_collection=1")
  //       .set({
  //         Authorization: `Bearer ${authenticationToken}`,
  //       })
  //       .send({
  //         title: "Wedding",
  //         description: "abadikan momen berhargamu",
  //         date: "2021/01/02",
  //         theme: "Dark Mode",
  //         showGallery: "true",
  //         downloadOption: "true",
  //       });
  //     console.log(res)

  //     expect(res.statusCode).toEqual(200);
  //     expect(res.body).toBeInstanceOf(Object);
  //     expect(res.body).toHaveProperty("message");
  //     expect(res.body.message).toEqual("Colection is already up to date");
  //   });
  // });

  describe("/GET collection", () => {
    it("it should GET all the collection", async () => {
      const res = await request(app)
        .get("/collection/all")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Get all collection");
    });
  });

  // describe("/GET collection", () => {
  //   it("it should GET ONE collection", async () => {
  //     const res = await request(app)
  //       .get("/collection/one?id_collection=1")
  //       .set({
  //         Authorization: `Bearer ${authenticationToken}`,
  //       });
  //     console.log(res)

  //     expect(res.statusCode).toEqual(200);
  //     expect(res.body).toBeInstanceOf(Object);
  //     expect(res.body).toHaveProperty("message");
  //     expect(res.body.message).toEqual("Success");
  //   });
  // });

  describe("/GET collection", () => {
    it("it should search a collection", async () => {
      const res = await request(app)
        .get("/collection/search?title=wedding")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Success");
    });
  });

  describe("/GET collection", () => {
    it("it should filter collection", async () => {
      const res = await request(app)
        .get("/collection/filter?showGallery=true&theme=Classic")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });
      console.log(res);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Get all collection");
    });
  });

  // describe("/PUT collection", () => {
  //   it("it should create password", async () => {
  //     const res = await request(app)
  //       .put("/collection/createPassword?id_collection=1")
  //       .set({
  //         Authorization: `Bearer ${authenticationToken}`,
  //       })
  //       .send({
  //         password: "coba1234",
  //       });
  //     console.log(res)

  //     expect(res.statusCode).toEqual(200);
  //     expect(res.body).toBeInstanceOf(Object);
  //     expect(res.body).toHaveProperty("message");
  //     expect(res.body.message).toEqual("Successfully created password");
  //   });
  // });

  describe("/PUT collection", () => {
    it("it should edit download setting", async () => {
      const res = await request(app)
        .put("/collection/downloadSetting?id_collection=1")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          original: "true",
          compress: "true",
          limit: "10",
        });
      console.log(res);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("download setting");
    });
  });

  describe("/GET collection validator", () => {
    it("it should error get one collection", async () => {
      const res = await request(app).get("/collection/one?id_collection=9");

      expect(res.statusCode).toEqual(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Collection Not Found");
    });
  });

  describe("/POST collection validator", () => {
    it("it should error title must be fill", async () => {
      const res = await request(app)
        .post("/collection")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          description: "abadikan momen berhargamu",
          date: "2021/01/01",
          theme: "Classic",
          showGallery: "true",
          downloadOption: "true",
          id_user: "1",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Title must be fill");
    });
  });

  describe("/POST collection validator", () => {
    it("it should error invalid date format", async () => {
      const res = await request(app)
        .post("/collection")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          title: "Wedding",
          description: "abadikan momen berhargamu",
          date: "01 Januari 2021",
          theme: "Classic",
          showGallery: "true",
          downloadOption: "true",
          id_user: "1",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Date is consist of yyyy/mm/dd");
    });
  });

  describe("/PUT collection validator", () => {
    it("it should collection not found", async () => {
      const res = await request(app)
        .put("/collection?id_collection=9")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          title: "Wedding",
          description: "abadikan momen berhargamu",
          date: "2021/01/02",
          theme: "Dark Mode",
          showGallery: "true",
          downloadOption: "true",
          id_user: "1",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Collection Not Found");
    });
  });

  // describe("/PUT collection validator", () => {
  //   it("it should error title must be fill", async () => {
  //     const res = await request(app)
  //       .put("/collection?id_collection=1")
  //       .set({
  //         Authorization: `Bearer ${authenticationToken}`,
  //       })
  //       .send({
  //         description: "abadikan momen berhargamu",
  //         date: "2021/01/02",
  //         theme: "Dark Mode",
  //         showGallery: "true",
  //         downloadOption: "true",
  //         id_user: "1",
  //       });
  //     console.log(res);

  //     expect(res.statusCode).toEqual(400);
  //     expect(res.body).toBeInstanceOf(Object);
  //     expect(res.body).toHaveProperty("message");
  //     expect(res.body.message).toEqual("Title must be fill");
  //   });
  // });

  // describe("/PUT collection validator", () => {
  //   it("it should error invalid date format", async () => {
  //     const res = await request(app)
  //       .put("/collection?id_collection=1")
  //       .set({
  //         Authorization: `Bearer ${authenticationToken}`,
  //       })
  //       .send({
  //         title: "Wedding",
  //         description: "abadikan momen berhargamu",
  //         date: "01 Januari 2021",
  //         theme: "Dark Mode",
  //         showGallery: "true",
  //         downloadOption: "true",
  //         id_user: "1",
  //       });
  //     console.log(res);

  //     expect(res.statusCode).toEqual(400);
  //     expect(res.body).toBeInstanceOf(Object);
  //     expect(res.body).toHaveProperty("message");
  //     expect(res.body.message).toEqual("Date is consist of yyyy/mm/dd");
  //   });
  // });

  // describe("/PUT collection validator", () => {
  //   it("it should error password already exist", async () => {
  //     const res = await request(app)
  //       .put("/collection/createPassword?id_collection=1")
  //       .set({
  //         Authorization: `Bearer ${authenticationToken}`,
  //       })
  //       .send({
  //         password: "coba1234",
  //       });
  //     console.log(res);

  //     expect(res.statusCode).toEqual(400);
  //     expect(res.body).toBeInstanceOf(Object);
  //     expect(res.body).toHaveProperty("message");
  //     expect(res.body.message).toEqual("Password already exist");
  //   });
  // });

  describe("/GET collection", () => {
    it("it should GET all the collection", async () => {
      const res = await request(app).get("/collection");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Success");
    });
  });

  // describe("/POST collection", () => {
  //   it("it should submit a password", async () => {
  //     const res = await request(app)
  //       .post("/collection/submit?id_collection=1")

  //       .send({
  //         password: "coba1234",
  //       });
  //     console.log(res);

  //     expect(res.statusCode).toEqual(201);
  //     expect(res.body).toBeInstanceOf(Object);
  //     expect(res.body).toHaveProperty("message");
  //     expect(res.body.message).toEqual("Success");
  //   });
  // });

  describe("/GET collection", () => {
    it("it should GET ONE collection", async () => {
      const res = await request(app)
        .get("/collection/oneUser?id_user=1")

        .send({
          id_user: "1",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Success");
    });
  });

  describe("/GET collection", () => {
    it("it should search a collection", async () => {
      const res = await request(app).get(
        "/collection/searchClient?title=par&id_user=1"
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Success");
    });
  });

  describe("/GET collection validator", () => {
    it("it should error should choose an opption", async () => {
      const res = await request(app)
        .get("/collection/download")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });
      console.log(res);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("input 1 or 2");
    });
  });

  // describe("/GET collection", () => {
  //   it("it should download a collection", async () => {
  //     const res = await request(app)
  //       .put("/collection/download?option=1")
  //       .set({
  //         Authorization: `Bearer ${authenticationToken}`,
  //       });
  //     console.log(res);

  //     expect(res.statusCode).toEqual(200);
  //     expect(res.body).toBeInstanceOf(Object);
  //     expect(res.body).toHaveProperty("message");
  //     expect(res.body.message).toEqual("Success");
  //   });
  // });

  describe("/POST collection", () => {
    it("it should error collection not found", async () => {
      const res = await request(app)
        .post("/collection/submit?id_collection=9")

        .send({
          password: "tes1234",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("collection not found");
    });
  });

  // describe("/POST collection", () => {
  //   it("it should error invalid password", async () => {
  //     const res = await request(app)
  //       .post("/collection/submit?id_collection=1")

  //       .send({
  //         password: "abcd321",
  //       });
  //     console.log(res);

  //     expect(res.statusCode).toEqual(400);
  //     expect(res.body).toBeInstanceOf(Object);
  //     expect(res.body).toHaveProperty("message");
  //     expect(res.body.message).toEqual("Wrong Password");
  //   });
  // });

  describe("/DELETE collection", () => {
    it("it should error delete collection", async () => {
      const res = await request(app)
        .delete("/collection/delete?id_collection=9")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Collection Not Found");
    });
  });

  // describe("/DELETE collection", () => {
  //   it("it should delete collection", async () => {
  //     const res = await request(app)
  //       .delete("/collection/delete?id_collection=1")
  //       .set({
  //         Authorization: `Bearer ${authenticationToken}`,
  //       });
  //     console.log(res);

  //     expect(res.statusCode).toEqual(200);
  //     expect(res.body).toBeInstanceOf(Object);
  //     expect(res.body).toHaveProperty("message");
  //     expect(res.body.message).toEqual("Success delete collection");
  //   });
  // });
});
