import Recipe from "../models/recipe.js";
import User from "../models/user.js";
import Category from "../models/category.js";
import { Op } from "sequelize";
import sequelize from "../db/sequelize.js";
import { paginatedResultDto } from "../helpers/pagination.js";

export const searchRecipes = async (filters = {}, pagination = {}) => {
  const { category, ingredient, area, q } = filters;
  const { page = 1, limit = 12 } = pagination;
  const offset = (page - 1) * limit;
  const whereClause = {};
  if (category) {
    whereClause.category = { [Op.iLike]: `%${category}%` };
  }
  if (area) {
    whereClause.area = { [Op.iLike]: `%${area}%` };
  }
  if (q) {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${q}%` } },
      { description: { [Op.iLike]: `%${q}%` } },
      { instructions: { [Op.iLike]: `%${q}%` } },
      sequelize.where(
        sequelize.fn('array_to_string', sequelize.col('ingredients'), ' '),
        { [Op.iLike]: `%${q}%` }
      )
    ];
  }
  if (ingredient) {
    whereClause.ingredients = {
      [Op.overlap]: [ingredient]
    };
  }
  const { count, rows } = await Recipe.findAndCountAll({
  where: whereClause,
  limit: parseInt(limit),
  offset: parseInt(offset),
  order: [["createdAt", "DESC"]],
  include: [
    {
      model: User,
      as: "author",
      attributes: ["id", "name", "avatar"],
    },
  ],
});
  return paginatedResultDto(
    rows,
    count,
    parseInt(page),
    parseInt(limit)
  );
};

export const getRecipeById = async (id) => {
  return await Recipe.findByPk(id);
};

export const getPopularRecipes = async (pagination = {}) => {
  const { page = 1, limit = 12 } = pagination;
  const offset = (page - 1) * limit;
  const { count, rows } = await Recipe.findAndCountAll({
    order: [
      ['favoritesCount', 'DESC'],
      ['createdAt', 'DESC']
    ],
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
  return paginatedResultDto(
    rows,
    count,
    parseInt(page),
    parseInt(limit)
  );
};

export const createRecipe = async (recipeData, userId) => {
  return await Recipe.create({
    ...recipeData,
    owner: userId
  });
};

export const deleteRecipe = async (id, userId) => {
  const recipe = await Recipe.findByPk(id);
  if (!recipe) {
    throw new Error('Recipe not found');
  }

  if (recipe.owner !== userId) {
    throw new Error('Forbidden: You can only delete your own recipes');
  }

  await recipe.destroy();
  return true;
};

export const getUserRecipes = async (userId, pagination = {}) => {
  const { page = 1, limit = 12 } = pagination;
  const offset = (page - 1) * limit;
  const { count, rows } = await Recipe.findAndCountAll({
    where: { owner: userId },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']]
  });
  return paginatedResultDto(
    rows,
    count,
    parseInt(page),
    parseInt(limit)
  );
};

export const addToFavorites = async (userId, recipeId) => {
  const tx = await sequelize.transaction();
  try {
    const user = await User.findByPk(userId, {
      transaction: tx,
      lock: tx.LOCK && tx.LOCK.UPDATE,
    });
    if (!user) throw new Error("User not found");

    const recipe = await Recipe.findByPk(recipeId, {
      transaction: tx,
      lock: tx.LOCK && tx.LOCK.UPDATE,
    });
    if (!recipe) throw new Error("Recipe not found");

    const rid = String(recipeId);
    const current = Array.isArray(user.favorites) ? user.favorites.map(String) : [];

    if (!current.includes(rid)) {
      user.set("favorites", [...current, rid]);
      await user.save({ transaction: tx });
      await recipe.increment("favoritesCount", { by: 1, transaction: tx });
    }

    await tx.commit();
    return true;
  } catch (err) {
    await tx.rollback();
    throw err;
  }
};

export const removeFromFavorites = async (userId, recipeId) => {
  const tx = await sequelize.transaction();
  try {
    // Рядкові locks зменшують гонки (Postgres)
    const user = await User.findByPk(userId, {
      transaction: tx,
      lock: tx.LOCK && tx.LOCK.UPDATE,
    });
    if (!user) throw new Error("User not found");

    const recipe = await Recipe.findByPk(recipeId, {
      transaction: tx,
      lock: tx.LOCK && tx.LOCK.UPDATE,
    });
    if (!recipe) throw new Error("Recipe not found");

    const rid = String(recipeId);
    const current = Array.isArray(user.favorites) ? user.favorites.map(String) : [];

    if (current.includes(rid)) {
      const next = current.filter((x) => x !== rid);
      user.set("favorites", next);
      await user.save({ transaction: tx });

      if ((recipe.favoritesCount ?? 0) > 0) {
        await recipe.decrement("favoritesCount", { by: 1, transaction: tx });
      }
    }

    await tx.commit();
    return true;
  } catch (err) {
    await tx.rollback();
    throw err;
  }
};

const toIntIds = (arr) => {
  const ids = (Array.isArray(arr) ? arr : [])
    .map((x) => String(x).trim())
    .filter((x) => /^\d+$/.test(x))
    .map((x) => parseInt(x, 10));

  return Array.from(new Set(ids));
};

export const getUserFavorites = async (userId, pagination = {}) => {
  const page = Math.max(1, parseInt(pagination.page ?? 1, 10) || 1);
  const limit = Math.max(1, parseInt(pagination.limit ?? 12, 10) || 12);
  const offset = (page - 1) * limit;

  const user = await User.findByPk(userId, { attributes: ["favorites"] });
  if (!user) {
    throw new Error("User not found");
  }

  const ids = toIntIds(user.favorites);

  if (ids.length === 0) {
    return paginatedResultDto([], 0, page, limit);
  }

  const { rows, count } = await Recipe.findAndCountAll({
    where: { id: { [Op.in]: ids } },
    order: [
      ["favoritesCount", "DESC"],
      ["createdAt", "DESC"],
    ],
    limit,
    offset,
  });

  return paginatedResultDto(rows, count, page, limit);
};

export const getRecipesByCategoryId = async (categoryId, pagination = {}) => {
  const { page = 1, limit = 12 } = pagination;
  const offset = (page - 1) * limit;
  // First, find the category by ID to get its name
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new Error("Category not found");
  }
  // Then find recipes that match this category name
  const { count, rows } = await Recipe.findAndCountAll({
    where: {
      category: category.name
    },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']]
  });
  return paginatedResultDto(
    rows,
    count,
    parseInt(page),
    parseInt(limit),
    { category: category.name }
  );
};

