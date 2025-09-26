import User from "../models/user.js";
import Recipe from "../models/recipe.js";

export const getFollowers = async (user) => {
  if (!user.followers || user.followers.length === 0) return [];
  const followers = await User.findAll({
    where: { id: user.followers },
    attributes: ["id", "name", "email", "avatar"],
  });
  return followers;
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
  return {
    avatar: user.avatar,
    name: user.name,
    email: user.email,
    createdRecipesCount,
    favoritesCount: user.favorites.length,
    followersCount: user.followers.length,
    followingCount: user.following.length,
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
  const user = await User.findByPk(id);
  if (!user) throw { status: 404, message: "User not found" };
  const createdRecipesCount = await Recipe.count({ where: { owner: user.id } });
  return {
    avatar: user.avatar,
    name: user.name,
    email: user.email,
    createdRecipesCount,
    followersCount: user.followers.length,
  };
};
