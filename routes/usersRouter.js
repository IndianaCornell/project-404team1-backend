import { Router } from "express";
import {
  getMe,
  getUserById,
  updateAvatar,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
} from "../controllers/usersController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { avatarUploader } from "../middlewares/uploadMiddleware.js";

const router = Router();

router.patch(
  "/avatar",
  authMiddleware,
  avatarUploader.single("avatar"),
  updateAvatar
);

router.get("/me", authMiddleware, getMe);
router.get("/followers", authMiddleware, getFollowers);
router.get("/following", authMiddleware, getFollowing);
router.post("/follow/:id", authMiddleware, followUser);
router.delete("/follow/:id", authMiddleware, unfollowUser);
router.get("/:id", authMiddleware, getUserById);

export default router;
