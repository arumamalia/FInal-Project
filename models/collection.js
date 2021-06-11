"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Collection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Collection.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      date: DataTypes.DATE,
      id_user: DataTypes.INTEGER,
      original: DataTypes.BOOLEAN,
      compress: DataTypes.BOOLEAN,
      limit: DataTypes.INTEGER,
      totalDownload: DataTypes.INTEGER,
      theme: DataTypes.STRING,
      showGallery: DataTypes.BOOLEAN,
      downloadOption: DataTypes.BOOLEAN,
      password: DataTypes.STRING,
      cover: {
        type: DataTypes.STRING,
        get() {
          const image = this.getDataValue("cover");
          return `${process.env.S3_URL}` + image;
        },
      },
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      freezeTableName: true,
      modelName: "collection",
    }
  );
  return Collection;
};
