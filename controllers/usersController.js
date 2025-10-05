import {
  getMe as getMeService,
  getUserById as getUserByIdService,
  updateAvatar as updateAvatarService,
  getFollowers as getFollowersService,
  getFollowing as getFollowingService,
  followUser as followUserService,
  unfollowUser as unfollowUserService,
  getFollowersByUserId as getFollowersByUserIdService,
  getFollowingByUserId as getFollowingByUserIdService,
} from "../services/usersService.js";
import { parsePagination } from "../helpers/pagination.js";


export const getFollowers = async (req, res, next) => {
  try {
    const data = await getFollowersService(req.user);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getFollowersByUserId = async (req, res, next) => {
  try {
    const { page, limit } = parsePagination(req.query);
    const data = await getFollowersByUserIdService(req.params.id, { page, limit });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getFollowingByUserId = async (req, res, next) => {
  try {
    const { page, limit } = parsePagination(req.query);
    const data = await getFollowingByUserIdService(req.params.id, { page, limit });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const data = await getMeService(req.user);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const data = await getUserByIdService(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getFollowing = async (req, res, next) => {
  try {
    const data = await getFollowingService(req.user);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const followUser = async (req, res, next) => {
  try {
    const data = await followUserService(req.user, req.params.id);
    res.json({ message: "Followed successfully", ...data });
  } catch (err) {
    next(err);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    const data = await unfollowUserService(req.user, req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const data = await updateAvatarService(req.user, req.file);
    res.json(data);
  } catch (err) {
    console.error("Update avatar error:", err);
    next(err);
  }
};
