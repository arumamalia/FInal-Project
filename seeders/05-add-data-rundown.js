"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("rundown", [
      {
        id_project: "1",
        person: "saske",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_project: "1",
        person: "narto",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_project: "2",
        person: "sakur",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("rundown", null, {});
  },
};
