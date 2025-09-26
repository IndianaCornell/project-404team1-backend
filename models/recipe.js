import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

const Recipe = sequelize.define(
  "Recipe",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    area: { type: DataTypes.STRING },
    instructions: { type: DataTypes.TEXT },
    description: { type: DataTypes.TEXT },
    thumb: { type: DataTypes.STRING },
    time: { type: DataTypes.STRING },
    owner: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: true,
  }
);

export default Recipe;
