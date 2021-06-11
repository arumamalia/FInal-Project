"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("user", [
      {
        name: "Firman",
        businessName: "PTFirman",
        photo: "",
        email: "firman@gmail.com",
        password: "firman123",
        // role: "photographer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Wawan",
        businessName: "PTWawan",
        photo: "",
        email: "Wawan@gmail.com",
        password: "firman123",
        // role: "photographer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ilham",
        businessName: "PTIlham",
        photo: "",
        email: "Ilham@gmail.com",
        password: "firman123",
        // role: "photographer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("user", null, {});
  },
};
