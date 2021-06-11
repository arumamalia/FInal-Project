"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("event", [
      {
        name: "makan siang",
        from: "12:00",
        to: "13:00",
        theme: "merah",
        description: "makan siang bersama",
        id_rundown: "1",
      },
      {
        name: "makan pagi",
        from: "08:00",
        to: "09:00",
        theme: "biru",
        description: "makan pagi bersama",
        id_rundown: "1",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("event", null, {});
  },
};
