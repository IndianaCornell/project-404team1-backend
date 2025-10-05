import User from "../models/user.js";
import Recipe from "../models/recipe.js";
import { Op } from 'sequelize';
import HttpError from '../helpers/HttpError.js';
import { paginatedResultDto } from '../helpers/pagination.js';

export const getFollowers = async (user) => {
  if (!user.followers || user.followers.length === 0) return [];
  const followers = await User.findAll({
    where: { id: user.followers },
    attributes: ["id", "name", "email", "avatar"],
  });
  return followers;
};

export const getFollowersByUserId = async (
  userId,
  { page = 1, limit = 12 } = {}
) => {
  const user = await User.findByPk(userId);
  if (!user) throw HttpError(404, 'User not found');

  const p = Number(page) || 1;
  const l = Number(limit) || 12;
  const offset = (p - 1) * l;

  const idsAll = (user.followers ?? []).map(String);
  const total = idsAll.length;

  const idsPage = idsAll.slice(offset, offset + l);

  const items = idsPage.length
    ? await User.findAll({
        where: { id: { [Op.in]: idsPage } },
        attributes: ['id', 'name', 'email', 'avatar'],
        order: [['createdAt', 'DESC']],
      })
    : [];

  return paginatedResultDto(items, total, p, l);
};


export const getFollowingByUserId = async (
  userId,
  { page = 1, limit = 12 } = {}
) => {
  const user = await User.findByPk(userId);
  if (!user) throw HttpError(404, 'User not found');

  const p = Number(page) || 1;
  const l = Number(limit) || 12;
  const offset = (p - 1) * l;

  const idsAll = (user.following ?? []).map(String);
  const total = idsAll.length;

  const idsPage = idsAll.slice(offset, offset + l);

  const items = idsPage.length
    ? await User.findAll({
        where: { id: { [Op.in]: idsPage } },
        attributes: ['id', 'name', 'email', 'avatar'],
        order: [['createdAt', 'DESC']],
      })
    : [];

  return paginatedResultDto(items, total, p, l);
};

export const updateAvatar = async (user, file) => {
  if (!file) throw { status: 400, message: "No file uploaded" };
  const avatarUrl = `/avatars/${file.filename}`;
  user.avatar = avatarUrl;
  await user.save();
  return { avatar: avatarUrl };
};

export const getMe = async (user) => {
  const createdRecipesCount = await Recipe.count({ where: { owner: user.id } });
  const favorites = Array.isArray(user.favorites)
    ? user.favorites.map(String)
    : [];
  return {
    avatar: user.avatar,
    name: user.name,
    email: user.email,
    createdRecipesCount,
    favoritesCount: user.favorites.length,
    followersCount: user.followers.length,
    followingCount: user.following.length,
    favorites : favorites,
  };
};

export const getFollowing = async (user) => {
  if (!user.following || user.following.length === 0) return [];
  const following = await User.findAll({
    where: { id: user.following },
    attributes: ["id", "name", "email", "avatar"],
  });
  return following;
};

export const followUser = async (currentUser, targetUserId) => {
  if (currentUser.id === targetUserId)
    throw { status: 400, message: "You cannot follow yourself" };
  const targetUser = await User.findByPk(targetUserId);
  if (!targetUser) throw { status: 404, message: "User not found" };
  if (!currentUser.following.includes(targetUserId)) {
    currentUser.following = [...currentUser.following, targetUserId];
    await currentUser.save();
  }
  if (!targetUser.followers.includes(currentUser.id)) {
    targetUser.followers = [...targetUser.followers, currentUser.id];
    await targetUser.save();
  }
  return { following: currentUser.following, followers: targetUser.followers };
};

export const unfollowUser = async (currentUser, targetUserId) => {
  if (currentUser.id === targetUserId)
    throw { status: 400, message: "You cannot unfollow yourself" };
  const targetUser = await User.findByPk(targetUserId);
  if (!targetUser) throw { status: 404, message: "User not found" };
  if (!currentUser.following.includes(targetUserId)) {
    return { message: "You are not following this user" };
  }
  currentUser.following = currentUser.following.filter(
    (id) => id !== targetUserId
  );
  await currentUser.save();
  if (targetUser.followers.includes(currentUser.id)) {
    targetUser.followers = targetUser.followers.filter(
      (id) => id !== currentUser.id
    );
    await targetUser.save();
  }
  return {
    message: "Unfollowed successfully",
    following: currentUser.following,
    followers: targetUser.followers,
  };
};

export const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: ["id", "avatar", "name", "email", "favorites", "followers"],
  });
  if (!user) throw { status: 404, message: "User not found" };

  const createdRecipesCount = await Recipe.count({
    where: { owner: String(user.id) },
  });

  const favorites = Array.isArray(user.favorites)
    ? user.favorites.map(String)
    : [];

  const followersCount = Array.isArray(user.followers)
    ? user.followers.length
    : 0;

  return {
    avatar: user.avatar,
    name: user.name,
    email: user.email,
    createdRecipesCount,
    followersCount,
    favorites,
    favoritesCount: favorites.length,
  };
};
