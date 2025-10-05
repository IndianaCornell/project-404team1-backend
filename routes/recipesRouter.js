import express from "express";
import * as recipesController from "../controllers/recipesController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { recipeImageUploader } from "../middlewares/uploadMiddleware.js";

const router = express.Router();
router.get("/favorites/all",recipesController.getFavorites);
router.get("/", recipesController.getRecipes);
router.get("/popular", recipesController.getPopularRecipes);
router.get("/my", authMiddleware, recipesController.getMyRecipes);
router.get("/:id", recipesController.getRecipeById);
router.get('/owner/:ownerId', recipesController.getByOwner);
router.post(
  "/",
  authMiddleware,
  recipeImageUploader.single("image"),
  recipesController.createRecipe
);
router.delete("/:id", authMiddleware, recipesController.deleteRecipe);
router.post("/:id/favorite", authMiddleware, recipesController.addToFavorites);
router.delete(
  "/:id/favorite",
  authMiddleware,
  recipesController.removeFromFavorites
);

export default router;
