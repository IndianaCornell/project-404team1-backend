import * as recipesService from "../services/recipesService.js";
import HttpError from "../helpers/HttpError.js";

export const getRecipes = async (req, res, next) => {
  try {
    const { category, ingredient, area, q, page = 1, limit = 12 } = req.query;
    const filters = { category, ingredient, area, q };
    const pagination = { page, limit };
    const result = await recipesService.searchRecipes(filters, pagination);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await recipesService.getRecipeById(id);
    if (!recipe) {
      throw HttpError(404, "Recipe not found");
    }
    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

export const getPopularRecipes = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const pagination = { page, limit };
    const result = await recipesService.getPopularRecipes(pagination);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createRecipe = async (req, res, next) => {
  try {
    const recipe = await recipesService.createRecipe(req.body, req.user.id);
    res.status(201).json(recipe);
  } catch (error) {
    next(error);
  }
};

export const deleteRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      await recipesService.deleteRecipe(id, req.user.id);
      res.status(204).send();
    } catch (serviceError) {
      if (serviceError.message === 'Recipe not found') {
        throw HttpError(404, "Recipe not found");
      }
      if (serviceError.message.includes('Forbidden')) {
        throw HttpError(403, "You can only delete your own recipes");
      }
      throw serviceError;
    }
  } catch (error) {
    next(error);
  }
};

export const getMyRecipes = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const pagination = { page, limit };
    const result = await recipesService.getUserRecipes(req.user.id, pagination);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const addToFavorites = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      await recipesService.addToFavorites(req.user.id, id);
      res.status(200).json({ message: "Recipe added to favorites" });
    } catch (serviceError) {
      if (serviceError.message === 'Recipe not found') {
        throw HttpError(404, "Recipe not found");
      }
      throw serviceError;
    }
  } catch (error) {
    next(error);
  }
};

export const removeFromFavorites = async (req, res, next) => {
  try {
    const { id } = req.params;
    await recipesService.removeFromFavorites(req.user.id, id);
    res.status(200).json({ message: "Recipe removed from favorites" });
  } catch (error) {
    next(error);
  }
};

export const getFavorites = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const pagination = { page, limit };
    const result = await recipesService.getUserFavorites(req.user.id, pagination);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

