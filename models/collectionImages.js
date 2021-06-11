"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CollectionImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CollectionImages.init(
    {
      image: {
        type: DataTypes.STRING,

        get() {
          const image = this.getDataValue("image");
          return `${process.env.S3_URL}` + image;
        },
      },
      id_collection: DataTypes.INTEGER,
    },
    {
      sequelize,
      paranoid: true, // Activate soft delete
      timestamps: true, // timestamps
      freezeTableName: true, // because we use Indonesian
      modelName: "collectionImages",
    }
  );
  return CollectionImages;
};
