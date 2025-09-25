import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

const Testimonial = sequelize.define(
  "Testimonial",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "owner_id",
    },
    testimonial: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "testimonials",
    timestamps: true,
    underscored: true,
  }
);

export default Testimonial;
