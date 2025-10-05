import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import HttpError from "../helpers/HttpError.js";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folder,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    },
  });

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/webp") {
    cb(null, true);
  } else {
    cb(
      new HttpError(400, "Invalid file type. Only JPEG, WEBP and PNG are allowed."),
      false
    );
  }
};

const createUploader = (folder) =>
  multer({
    storage: createStorage(folder),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  });

export const recipeImageUploader = createUploader("recipes");
export const avatarUploader = createUploader("avatars");
