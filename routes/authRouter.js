import { Router } from "express";
import { register, login, logout, getCurrent  } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/refresh", authMiddleware, getCurrent);

export default router;
