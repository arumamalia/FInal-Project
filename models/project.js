"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  project.init(
    {
      id_user: DataTypes.INTEGER,
      id_package: DataTypes.INTEGER,
      title: DataTypes.STRING,
      date: DataTypes.DATEONLY,
      description: DataTypes.STRING,
      clientName: DataTypes.STRING,
      clientAddress: DataTypes.STRING,
      isCompleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      freezeTableName: true,
      modelName: "project",
    }
  );
  return project;
};
