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
import multer from "multer";
import path from "path";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/avatars");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, req.user.id + ext);
  },
});
const upload = multer({ storage });

router.patch("/avatar", authMiddleware, upload.single("avatar"), updateAvatar);

router.get("/me", authMiddleware, getMe);
router.get("/followers", authMiddleware, getFollowers);
router.get("/following", authMiddleware, getFollowing);
router.post("/follow/:id", authMiddleware, followUser);
router.delete("/follow/:id", authMiddleware, unfollowUser);
router.get(":id", authMiddleware, getUserById);

export default router;
