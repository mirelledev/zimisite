import User from "../models/User";
import { Request, Response } from "express";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IGetUserAuthInfoRequest } from "../@types/express";
import Post from "../models/Post";

dotenv.config();
const bcrypt = require("bcryptjs");
const jwtSecret = process.env.JWT_SECRET as string;

const generateToken = (id: Types.ObjectId): string => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: "7d" });
};

const register = async (req: Request, res: Response) => {
  const { name, username, email, password } = req.body;
  const userEmail = await User.findOne({ email });
  const existingUser = await User.findOne({ username });

  if (userEmail) {
    res.status(422).json({ errors: ["Por favor, utilize outro e-mail"] });
    return;
  }
  if (existingUser) {
    res
      .status(422)
      .json({ errors: ["@username já em uso, por favor utilize outro."] });
    return;
  }

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  const newUser = await User.create({
    name,
    username,
    email,
    password: passwordHash,
  });

  if (!newUser) {
    res
      .status(422)
      .json({ errors: ["Houve um erro, tente novamente mais tarde"] });
    return;
  }

  res.status(201).json({
    id: newUser._id,
    name: newUser.name,
    username: newUser.username,
    profilePicture: newUser.profileImage,
    token: generateToken(newUser._id),
    followers: newUser.followers,
    following: newUser.following,
  });
};

const login = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(422).json({ errors: ["Usuário não econtrado"] });
    return;
  }

  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ errors: ["Senha incorreta"] });
    return;
  }

  res.status(201).json({
    id: user._id,
    name: user.name,
    username: user.username,
    token: generateToken(user._id),
    profilePicture: user.profileImage,
    followers: user.followers,
    following: user.following,
  });
};

const getUserById = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password");

  if (!user) {
    res.status(404).json({ errors: ["Usuário não encontrado"] });
    return;
  }

  res.status(200).json(user);
};

const getCurrentUser = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const reqUser = req.user;

  res.status(200).json(reqUser);
};

const update = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { name, username, password, bio } = req.body;

  let profileImage = null;
  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;
  const user = await User.findById(reqUser._id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  if (name) {
    user.name = name;
  }

  if (password) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    user.password = passwordHash;
  }

  if (profileImage) {
    user.profileImage = profileImage;
  }

  if (bio) {
    user.bio = bio;
  }

  if (username) {
    user.username = username;
  }

  await user.save();

  const updateFieldsForPosts = {
    ...(name && { userRealName: name }),
    ...(username && { username: username }),
    ...(profileImage && { userProfilePicture: profileImage }),
  };

  const updateFieldsForComments = {
    ...(name && { "comments.$[elem].userRealName": name }),
    ...(username && { "comments.$[elem].username": username }),
    ...(profileImage && {
      "comments.$[elem].userProfilePicture": profileImage,
    }),
  };

  if (Object.keys(updateFieldsForPosts).length > 0) {
    await Post.updateMany(
      { userId: reqUser._id },
      { $set: updateFieldsForPosts }
    );
  }

  if (Object.keys(updateFieldsForComments).length > 0) {
    await Post.updateMany(
      { "comments.userId": reqUser._id },
      { $set: updateFieldsForComments },
      { arrayFilters: [{ "elem.userId": reqUser._id }] }
    );
  }

  res.status(200).json(user);
};

const followUser = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    const user = await User.findById(reqUser._id);
    const userFollowed = await User.findById(id);

    if (!userFollowed) {
      return res
        .status(404)
        .json({ errors: ["Não foi possível realizar essa ação"] });
    }

    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado"] });
    }

    const userFollowedInfo = {
      userId: userFollowed._id,
      name: userFollowed.name,
      username: userFollowed.username,
      profileImage: userFollowed.profileImage,
    };

    const userFollowingInfo = {
      userId: user._id,
      name: user.name,
      username: user.username,
      profileImage: user.profileImage,
    };

    const alreadyFollowing = user.following.some(
      (following) =>
        following.userId && following.userId.equals(userFollowed._id)
    );

    if (alreadyFollowing) {
      user.following = user.following.filter(
        (following) =>
          following.userId && !following.userId.equals(userFollowed._id)
      );
      userFollowed.followers = userFollowed.followers.filter(
        (follower) => follower.userId && !follower.userId.equals(user._id)
      );

      await user.save();
      await userFollowed.save();

      return res.status(200).json({
        followers: userFollowed.followers,
        following: user.following,
        message: `O usuário ${user.name} parou de seguir ${userFollowed.name}`,
      });
    } else {
      user.following.push(userFollowedInfo);
      userFollowed.followers.push(userFollowingInfo);

      await user.save();
      await userFollowed.save();

      return res.status(200).json({
        followers: userFollowed.followers,
        following: user.following,
        userFollowingInfo,
        message: `O usuário ${userFollowed.name} foi seguido por ${user.name}`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Ocorreu um erro"] });
  }
};

const deleteUser = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const reqUser = req.user;
  const user = await User.findById(reqUser._id);

  if (!user) {
    res
      .status(500)
      .json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
    return;
  }

  if (!reqUser._id.equals(user._id)) {
    res
      .status(404)
      .json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
    return;
  }

  await User.findByIdAndDelete(user._id);
  res.status(200).json({
    userId: user._id,
    name: user.name,
    message: "Usuário excluido com sucesso.",
  });
};

module.exports = {
  register,
  login,
  getUserById,
  getCurrentUser,
  update,
  followUser,
  deleteUser,
};
