"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  event.init(
    {
      name: DataTypes.STRING,
      from: DataTypes.STRING,
      to: DataTypes.STRING,
      theme: DataTypes.STRING,
      description: DataTypes.STRING,
      id_rundown: DataTypes.INTEGER,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      freezeTableName: true,
      modelName: "event",
    }
  );
  return event;
};
