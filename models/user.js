"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init(
    {
      name: DataTypes.STRING,
      businessName: DataTypes.STRING,
      address: DataTypes.STRING,
      photo: {
        type: DataTypes.STRING,
        get() {
          const image = this.getDataValue("photo");

          if (!image) {
            return image;
          }

          return "/images/" + image;
        },
      },
      email: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        set(val) {
          // as usual how about async encrypt task
          const encryptPassword = bcrypt.hashSync(val, 10);
          this.setDataValue("password", encryptPassword);
        },
      },
      role: DataTypes.STRING,
      address: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      freezeTableName: true,
      modelName: "user",
    }
  );
  return user;
};
