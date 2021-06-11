"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("project", [
      {
        id_user: "1",
        id_package: "1",
        title: "Julian & Jane Wedding",
        date: new Date(),
        description: "Wedding in Solo",
        clientName: "Julian",
        clientAddress: "Jakarta",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_user: "2",
        id_package: "1",
        title: "Julian & Jane Wedding",
        date: new Date(),
        description: "Wedding in Solo",
        clientName: "Julian",
        clientAddress: "Jakarta",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_user: "3",
        id_package: "1",
        title: "Julian & Jane Wedding",
        date: new Date(),
        description: "Wedding in Solo",
        clientName: "Julian",
        clientAddress: "Jakarta",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("project", null, {});
  },
};
