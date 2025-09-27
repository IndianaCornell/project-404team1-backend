import express from "express";
import * as recipesController from "../controllers/recipesController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", recipesController.getRecipes);
router.get("/popular", recipesController.getPopularRecipes);
router.get("/category/:categoryId", recipesController.getRecipesByCategoryId);
router.get("/my", authMiddleware, recipesController.getMyRecipes);
router.get("/:id", recipesController.getRecipeById);
router.post("/", authMiddleware, recipesController.createRecipe);
router.delete("/:id", authMiddleware, recipesController.deleteRecipe);
router.post("/:id/favorite", authMiddleware, recipesController.addToFavorites);
router.delete("/:id/favorite", authMiddleware, recipesController.removeFromFavorites);

export default router;
