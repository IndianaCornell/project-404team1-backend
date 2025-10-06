import Area from "../models/area.js";
import sequelize from "../db/sequelize.js";

export const getAllAreas = async () => {
  return await Area.findAll({
    order: [[sequelize.fn("LOWER", sequelize.col("name")), "ASC"]],
  });
};
