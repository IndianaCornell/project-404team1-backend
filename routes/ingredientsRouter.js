import { Router } from "express";
import { getIngredients } from "../controllers/ingredientsController.js";

const router = Router();
router.get("/", getIngredients);

export default router;
