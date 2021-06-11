"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("collection", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      showGallery: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      downloadOption: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      password: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      id_user: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      original: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      compress: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      limit: {
        allowNull: true,
        type: Sequelize.INTEGER,
        defaultValue: "20",
      },
      totalDownload: {
        allowNull: false,
        defaultValue: "0",
        type: Sequelize.INTEGER,
      },
      cover: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      theme: {
        allowNull: true,
        defaultValue: "Classic",
        type: Sequelize.STRING,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addConstraint("collection", {
      fields: ["id_user"],
      type: "foreign key",
      name: "custom_fkey_id_user_collection",
      references: {
        table: "user",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("collection");
  },
};
