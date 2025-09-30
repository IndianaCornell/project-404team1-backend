import Ingredient from "../models/ingredient.js";
import { parsePagination, paginatedResultDto } from "../helpers/pagination.js";

export const getAllIngredients = async (query) => {
  const { page, limit } = parsePagination(query);
  const offset = (page - 1) * limit;

  const { rows, count } = await Ingredient.findAndCountAll({
    attributes: ["id", "name", "desc", "img"],
    order: [["name", "ASC"]],
    offset,
    limit,
  });

  return paginatedResultDto(rows, count, page, limit);
};
