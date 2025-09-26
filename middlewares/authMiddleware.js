import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [type, token] = authHeader.split(" ");
    if (type !== "Bearer" || !token) throw HttpError(401, "Not authorized");
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw HttpError(401, "Invalid token");
    }
    const user = await User.findByPk(payload.id);
    if (!user) throw HttpError(401, "User not found");
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;
