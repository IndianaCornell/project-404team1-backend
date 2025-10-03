import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import gravatar from "gravatar";
import Joi from "joi";

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(32).required(),
});

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(32).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(32).required(),
});

export const register = async (payload) => {
  const { error } = registerSchema.validate(payload);
  if (error) throw HttpError(400, error.message);
  const { name, email, password } = payload;
  const userExists = await User.findOne({ where: { email } });
  if (userExists) throw HttpError(409, "Email in use");
  const hashPassword = await bcrypt.hash(password, 10);
  const avatar = gravatar.url(email, { s: "250", d: "retro" }, true);
  const user = await User.create({
    id: nanoid(),
    name,
    email,
    password: hashPassword,
    avatar,
  });
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  };
};

export const login = async (payload) => {
  const { error } = loginSchema.validate(payload);
  if (error) throw HttpError(400, error.message);
  const { email, password } = payload;
  const user = await User.findOne({ where: { email } });
  if (!user) throw HttpError(401, "Email or password is wrong");
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw HttpError(401, "Email or password is wrong");
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
const favorites = Array.isArray(user.favorites)
    ? user.favorites.map(String)
    : [];

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      favorites,
      favoritesCount: favorites.length, 
    },
  };
};

export const logout = async () => {
  return { message: "logout ok" };
};
