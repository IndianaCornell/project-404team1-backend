import * as ingredientsService from "../services/ingredientsService.js";

export const getIngredients = async (req, res, next) => {
  try {
    const result = await ingredientsService.getAllIngredients(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
