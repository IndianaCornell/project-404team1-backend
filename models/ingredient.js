import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

const Ingredient = sequelize.define("Ingredient", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desc: {
    type: DataTypes.TEXT,
  },
  img: {
    type: DataTypes.STRING,
  },
}, {
  tableName: "ingredients",
  timestamps: false,
});

export default Ingredient;