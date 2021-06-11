"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("category", [
      {
        name: "Photo Session",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Videography",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Print",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Digital",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Other",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("category", null, {});
  },
};
