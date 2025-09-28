import express from "express";
import * as areasController from "../controllers/areasController.js";

const router = express.Router();

router.get("/", areasController.getAreas);

export default router;
