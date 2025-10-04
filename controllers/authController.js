import * as service from "../services/authService.js";

export const register = async (req, res, next) => {
  try {
    const data = await service.register(req.body);
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = await service.login(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

export const logout = async (req, res, next) => {
  try {
    const data = await service.logout();
    res.json(data);
  } catch (e) {
    next(e);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const data = await service.current(req.user.id);
    res.json(data); // { id, name, email, avatar, favorites, favoritesCount }
  } catch (e) {
    next(e);
  }
};
