import express from "express";
import * as recipesController from "../controllers/recipesController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, recipesController.getFavorites);

export default router;
