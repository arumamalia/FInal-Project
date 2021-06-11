"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class detailInvoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  detailInvoice.init(
    {
      id_invoice: DataTypes.INTEGER,
      name: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      freezeTableName: true,
      modelName: "detailInvoice",
    }
  );
  return detailInvoice;
};
