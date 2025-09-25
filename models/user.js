import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    followers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    following: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    tableName: "users",
    timestamps: true,
    underscored: true,
  }
);

export default User;
