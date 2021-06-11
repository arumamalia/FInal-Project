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
      email: "rioyanuarr90@gmail.com",
      password: "Riko12344!!",
      confirmPassword: "Riko12344!!",
      name: "Riko Yanuarr",
      businessName: "Riko studioo",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual("success");
    expect(res.body).toHaveProperty("token");
  });
});

describe("/can not signup POST", () => {
  it("It should not make user and get the token", async () => {
    const res = await request(app).post("/auth/signup").send({
      email: "rioyanuarr90@gmail.com",
      password: "Riko12344!!",
      confirmPassword: "Riko1234!!",
      name: "Riko Yanuarr",
      businessName: "Riko studioo",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(
      "email already exist, Password confirmation must be same as password"
    );
  });
});

describe("/can not signup POST because email invalid", () => {
  it("It should not make user and get the token", async () => {
    const res = await request(app).post("/auth/signup").send({
      email: "rioyanuarr90",
      password: "Riko12344!!",
      confirmPassword: "Riko12344!!",
      name: "Riko Yanuarr",
      businessName: "Riko studioo",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Email field must be valid email");
  });
});

describe("/can not signup POST because email already exist", () => {
  it("It should not make user and get the token", async () => {
    const res = await request(app).post("/auth/signup").send({
      email: "rioyanuarr90@gmail.com",
      password: "Riko12344!!",
      confirmPassword: "Riko12344!!",
      name: "Riko Yanuarr",
      businessName: "Riko studioo",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("email already exist");
  });
});

describe("/signup POST weak password", () => {
  it("It should not make user and get the token", async () => {
    const res = await request(app).post("/auth/signup").send({
      email: "rioyanuarr97@gmail.com",
      password: "Rikoaja",
      confirmPassword: "Rikoaja",
      name: "Riko Yanuarr",
      businessName: "Riko studioo",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(
      "Password needs (uppercase & lowercase characters, number, and symbol)"
    );
  });
});

describe("/signin email invalid POST", () => {
  it("It should not make user login and get authentication_key (jwt)", async () => {
    const res = await request(app).post("/auth/signin").send({
      email: "rioyanuarr9",
      password: "Riko1234!!",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Email field must be valid email");

    authenticationToken = res.body.token;
  });
});

describe("/signin wrong email POST", () => {
  it("It should not make user login and get authentication_key (jwt)", async () => {
    const res = await request(app).post("/auth/signin").send({
      email: "rioyanuarr9@gmail.com",
      password: "Riko1234!!",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("User is not found!");

    authenticationToken = res.body.token;
  });
});

describe("/signin wrong password POST", () => {
  it("It should not make user login and get authentication_key (jwt)", async () => {
    const res = await request(app).post("/auth/signin").send({
      email: "rioyanuarr90@gmail.com",
      password: "Riko1234!!",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Wrong password!");

    authenticationToken = res.body.token;
  });
});

//GA DAPAT TOKEN
// describe("GET user", () => {
//   it("Error: No auth token", async () => {
//     const res = await request(app).get(`/user/`);

//     expect(res.statusCode).toEqual(400);
//     expect(res.body).toBeInstanceOf(Object);
//     expect(res.body).toHaveProperty("message");
//     expect(res.body.message).toEqual("No auth token");
//   });
// });

describe("/signin POST", () => {
  it("It should make user login and get authentication_key (jwt)", async () => {
    const res = await request(app).post("/auth/signin").send({
      email: "rioyanuarr90@gmail.com",
      password: "Riko12344!!",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual("success");
    expect(res.body).toHaveProperty("token");

    authenticationToken = res.body.token;
  });
});

describe("/GET user", () => {
  it("it should GET all the user", async () => {
    const res = await request(app)
      .get("/user/")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Get all user");
  });
});

describe("/GET ONE user", () => {
  it("it should GET ONE user", async () => {
    const res = await request(app)
      .get("/user/one")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Get One user");
  });
});

// describe("/GET ONE user", () => {
//   it("it should error GET ONE user", async () => {
//     const res = await request(app)
//       .get("/user/one?id=10")
//       .set({
//         Authorization: `Bearer ${authenticationToken}`,
//       });

//     expect(res.statusCode).toEqual(400);
//     expect(res.body).toBeInstanceOf(Object);
//     expect(res.body.message).toEqual("user Not Found");
//   });
// });

describe("/GET ONE No auth token and get false", () => {
  it("it should GET ONE user", async () => {
    const res = await request(app).get("/user/one?id=1");

    expect(res.statusCode).toEqual(403);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("No auth token");
  });
});

describe("/GET ONE No auth token", () => {
  it("it should GET ONE user", async () => {
    const res = await request(app).get("/user/one");

    expect(res.statusCode).toEqual(403);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("No auth token");
  });
});

describe("/put user wrong endpoint", () => {
  it("it should not update user", async () => {
    const res = await request(app)
      .put("/user/one")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual(undefined);
  });
});

describe("/put user No auth token", () => {
  it("it should not update user", async () => {
    const res = await request(app)
      .put("/user")

      .send({
        name: "Najmul LA",
        businessName: "Najmul",
        address: "Tangerang",
      });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("No auth token");
  });
});

// describe("/put user name must be fill", () => {
//   it("it should name must be fill", async () => {
//     const res = await request(app)
//       .put("/user")
//       .set({
//         Authorization: `Bearer ${authenticationToken}`,
//       })
//       .send({
//         businessName: "Najmul",
//         address: "Tangerang",
//       });
//     expect(res.statusCode).toEqual(400);
//     expect(res.body).toBeInstanceOf(Object);
//     expect(res.body).toHaveProperty("message");
//     expect(res.body.message).toEqual("name must be fill");
//   });
// });

describe("/put user name must be fill", () => {
  it("it should name must be fill", async () => {
    const res = await request(app)
      .put("/user")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      })
      .send({
        businessName: "NajmulLAa",
        email: "najmulaila",
        address: "Tangerangcity",
        photo: 1234,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("name must be fill");
  });
});

describe("/put user name must be fill", () => {
  it("it should businessName must be fill", async () => {
    const res = await request(app)
      .put("/user")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      })
      .send({
        name: "",

        address: "Tangerang",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("name must be fill");
  });
});

describe("/put eror token", () => {
  it("it should address must be fill", async () => {
    const res = await request(app)
      .put("/user")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      })
      .send({
        name: "Najmul LA",
        businessName: "Laila",
        address: "",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("address must be fill");
  });
});

// describe("/put user upload image", () => {
//   it("it should put user upload image", async () => {
//     const res = await request(app)
//       .put("/user")
//       .set({
//         Authorization: `Bearer ${authenticationToken}`,
//       })
//       .send({
//         name: "NajmulLAILAaull",
//         businessName: "NajmulLAa",
//         email: "najmulaila",
//         address: "Tangerangcity",
//         photo: "/home/najmul/Pictures/j.png",
//       });
//     expect(res.statusCode).toEqual(400);
//     expect(res.body).toBeInstanceOf(Object);
//     expect(res.body.message).toEqual("Email field must be valid email");
//   });
// });

describe("/put user", () => {
  it("it should update user", async () => {
    const res = await request(app)
      .put("/user")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      })
      .send({
        name: "NajmulLAILAaull",
        businessName: "NajmulLAa",
        address: "Tangerangcity",
        email: "najmullaila@gmail.com",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual("updated user");
  });
});

describe("/DELETE user", () => {
  it("it should delete user", async () => {
    const res = await request(app)
      .delete("/user?id=1")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Success delete user");
  });
});

describe("/DELETE user failed", () => {
  it("it should delete user not authorized", async () => {
    const res = await request(app)
      .delete("/user?id=1")
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("You're not authorized");
  });
});

// describe("/DELETE user failed", () => {
//   it("it should error delete user", async () => {
//     const res = await request(app)
//       .delete("/user?id=1")
//       .set({
//         Authorization: `Bearer ${authenticationToken}`,
//       });

//     expect(res.statusCode).toEqual(400);
//     expect(res.body).toBeInstanceOf(Object);
//     expect(res.body.message).toEqual("Data Not Found");
//   });
// });

describe("/DELETE user failed", () => {
  it("it should delete user", async () => {
    const res = await request(app).delete("/user?id=1");

    expect(res.statusCode).toEqual(403);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("No auth token");
  });
});

describe("/GET all user not found", () => {
  it("it should GET all the user", async () => {
    const res = await request(app).get("/user/");

    expect(res.statusCode).toEqual(500);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("user not found");
  });
});
//
