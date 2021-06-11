"use strict";
const { Model, STRING } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  invoice.init(
    {
      id_project: DataTypes.INTEGER,
      invoiceName: DataTypes.STRING,
      issuedDate: DataTypes.DATEONLY,
      dueDate: DataTypes.DATEONLY,
      isPaid: DataTypes.BOOLEAN,
      paidCost: DataTypes.INTEGER,
      subtotal: DataTypes.INTEGER,
      amountDue: DataTypes.INTEGER,
      billToName: DataTypes.STRING,
      billToAddress: DataTypes.STRING,
      // paymentDate: DataTypes.DATEONLY,
      receipt: {
        type: DataTypes.STRING,
        get() {
          const image = this.getDataValue("receipt");
          if (image) {
            return `${process.env.S3_URL}` + image;
          }
        },
      },
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      freezeTableName: true,
      modelName: "invoice",
    }
  );
  return invoice;
};
