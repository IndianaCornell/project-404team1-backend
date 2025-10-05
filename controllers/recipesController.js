import * as recipesService from "../services/recipesService.js";
import HttpError from "../helpers/HttpError.js";
import { parsePagination } from "../helpers/pagination.js";

export const getRecipes = async (req, res, next) => {
  try {
    const { category, ingredient, area, q } = req.query;
    const { page, limit } = parsePagination(req.query);
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

export const getByOwner = async (req, res, next) => {
  try {
    const { page, limit } = parsePagination(req.query);
    const data = await recipesService.getRecipesByOwner(req.params.ownerId, { page, limit });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getPopularRecipes = async (req, res, next) => {
  try {
    const { page, limit } = parsePagination(req.query);
    const pagination = { page, limit };
    const result = await recipesService.getPopularRecipes(pagination);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createRecipe = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      thumb: req.file?.path || null,
    };

    const recipe = await recipesService.createRecipe(data, req.user.id);
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
    const { page, limit } = parsePagination(req.query);
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
    const { page, limit } = parsePagination(req.query);
    const pagination = { page, limit };

    const requestedUserId = req.query.userId;         

    let targetUserId;

    if (requestedUserId) {
      targetUserId = requestedUserId;
    }else {
      return res.status(400).json({ message: "userId is required" });
    }
    const result = await recipesService.getUserFavorites(targetUserId, pagination);
    res.json(result);
  } catch (error) {
    next(error);
  }
};


export const getRecipesByCategoryId = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { page, limit } = parsePagination(req.query);
    const pagination = { page, limit };
    const result = await recipesService.getRecipesByCategoryId(categoryId, pagination);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

