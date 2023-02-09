import { DataTypes, Model } from "sequelize"
import { sequelize } from "./db.js"

export class MetaData extends Model {}

MetaData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      unique: true,
    },
    links: {
      type: DataTypes.INTEGER,
    },
    images: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: "MetaData",
  }
)
