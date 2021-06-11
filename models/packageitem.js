"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class packageItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  packageItem.init(
    {
      itemName: DataTypes.STRING,
      price: DataTypes.INTEGER,
      id_package: DataTypes.INTEGER,
      id_category: DataTypes.INTEGER,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      freezeTableName: true,
      modelName: "packageItem",
    }
  );
  return packageItem;
};
