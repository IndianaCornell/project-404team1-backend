import * as categoriesService from "../services/categoriesService.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await categoriesService.getAllCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};
