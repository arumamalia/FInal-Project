"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("collection", [
      {
        title: "wedding",
        description: "blablabla",
        id_user: "1",
        date: "2020/09/10",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "travel",
        description: "blablabla",
        id_user: "2",
        date: "2020/09/10",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "party",
        description: "blablabla",
        id_user: "3",
        date: "2020/09/10",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("collection", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
