import {DataTypes} from "sequelize";
import sequelize from "../db/sequelize.js";
import User from "./user.js";

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
    favoritesCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    ingredients: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: []
    }
  },
  {
    timestamps: true,
  }
);

Recipe.belongsTo(User, {
  as: "author",
  foreignKey: "owner",
  targetKey: "id"
});

export default Recipe;
