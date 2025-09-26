import {
  getMe as getMeService,
  getUserById as getUserByIdService,
  updateAvatar as updateAvatarService,
  getFollowers as getFollowersService,
  getFollowing as getFollowingService,
  followUser as followUserService,
  unfollowUser as unfollowUserService,
} from "../services/usersService.js";

export const getFollowers = async (req, res, next) => {
  try {
    const data = await getFollowersService(req.user);
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
    next(err);
  }
};
