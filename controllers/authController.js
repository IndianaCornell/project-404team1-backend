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
