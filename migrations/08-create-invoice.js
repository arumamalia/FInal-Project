"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("invoice", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_project: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      invoiceName: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      issuedDate: {
        allowNull: true,
        type: Sequelize.DATEONLY,
      },
      dueDate: {
        allowNull: true,
        type: Sequelize.DATEONLY,
      },
      isPaid: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      paidCost: {
        allowNull: true,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      subtotal: {
        allowNull: true,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      amountDue: {
        allowNull: true,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      billToName: {
        allowNull: true,
        defaultValue: 0,
        type: Sequelize.STRING,
      },
      billToAddress: {
        allowNull: true,
        defaultValue: 0,
        type: Sequelize.STRING,
      },
      // paymentDate: {
      //   allowNull: true,
      //   type: Sequelize.DATEONLY,
      // },
      receipt: {
        allowNull: true,
        defaultValue: 0,
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
    await queryInterface.addConstraint("invoice", {
      fields: ["id_project"],
      type: "foreign key",
      name: "custom_fkey_id_project_invoice",
      references: {
        //Required field
        table: "project",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("invoice");
  },
};
