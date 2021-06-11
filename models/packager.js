"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class packager extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  packager.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      image: {
        type: DataTypes.STRING,

        get() {
          const image = this.getDataValue("image");
          return `${process.env.S3_URL}` + image;
        },
      },
      itemCount: DataTypes.INTEGER,
      totalPrice: DataTypes.INTEGER,
      id_user: DataTypes.INTEGER,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      freezeTableName: true,
      modelName: "packager",
    }
  );
  return packager;
};
