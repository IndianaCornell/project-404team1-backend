import Category from "../models/category.js";

export const getAllCategories = async () => {
  return await Category.findAll({
    order: [['name', 'ASC']]
  });
};
