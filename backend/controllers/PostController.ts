import Post from "../models/Post";
import mongoose from "mongoose";
import User from "../models/User";
import { IGetUserAuthInfoRequest } from "../@types/express";
import { Response } from "express";

const addPost = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { text } = req.body;
  const reqUser = req.user;
  const user = await User.findById(reqUser._id);

  if (!user) {
    res
      .status(422)
      .json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
    return;
  }

  const newPost = await Post.create({
    text,
    userId: user._id,
    username: user.username,
    userRealName: user.name,
    userProfilePicture: user.profileImage,
  });

  if (!newPost) {
    res
      .status(422)
      .json({ errors: ["Ocorreu um erro, tente novamente mais tarde."] });
    return;
  }

  res.status(201).json(newPost);
};

const deletePost = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { id } = req.params;
  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  try {
    const post = await Post.findById(id);
    if (!post) {
      res
        .status(422)
        .json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
      return;
    }

    if (!post.userId?.equals(user!._id)) {
      res
        .status(422)
        .json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
      return;
    }

    await Post.findByIdAndDelete(post._id);

    res.status(200).json({
      id: post._id,
      text: post.text,
      message: "Postagem excluída com sucesso",
    });
  } catch (error) {
    res.status(404).json({ errors: ["Postagem não encontrada."] });
    return;
  }
};

const getAllPosts = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const posts = await Post.find({})
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(posts);
};

const getUserPosts = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { id } = req.params;
  const posts = await Post.find({ userId: id })
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(posts);
};

const getPostById = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) {
    res.status(404).json({ errors: ["Postagem não encontrada"] });
    return;
  }

  res.status(200).json(post);
};

const likePost = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { id } = req.params;
  const reqUser = req.user;
  const user = await User.findById(reqUser._id);

  const post = await Post.findById(id);
  if (!post) {
    res.status(404).json({ errors: ["Postagem não encontrada."] });
    return;
  }

  const alreadyLike = await post.likes.filter((userId) => {
    return reqUser.equals(userId);
  });

  if (alreadyLike.length > 0) {
    const othersLike = await post.likes.filter((userId) => {
      return !reqUser.equals(userId);
    });

    post.likes = [...othersLike];
    post.save();
    return res.status(200).json({
      userId: String(user?._id),
      post,
      postId: id,
      message: "Like removido",
      likes: post.likes,
    });
  }

  post.likes.push(reqUser._id);
  await post.save();
  return res.status(200).json({
    userId: String(user?._id),
    post: post.text,
    postId: post.id,
    message: "Postagem curtida com sucesso",
    likes: post.likes,
  });
};
const commentPost = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { id } = req.params;
  const { comment } = req.body;
  const reqUser = req.user;
  const user = await User.findById(reqUser._id);
  const post = await Post.findById(id);

  if (!post) {
    res.status(404).json({ errors: ["Postagem não encontrada."] });
    return;
  }

  const userComment = {
    userProfilePicture: user?.profileImage,
    comment,
    userRealName: user?.name,
    username: user?.username,
    userId: user?._id,
  };

  post.comments.push(userComment);
  await post.save();

  res.status(200).json({
    comment: userComment,
    messagem: "Comentário postado com sucesso",
  });
};

const getPostComments = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { id } = req.params;
  const reqUser = req.user;
  const user = await User.findById(reqUser._id);

  const post = await Post.findById(id);
  if (!post) {
    res.status(404).json({ errors: ["Postagem não encontrada"] });
    return;
  }

  res.status(200).json({
    comments: post.comments,
    messagem: "Pegou os comentarios!",
  });
};

const searchPostAndUsers = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  const q = req.query.q as string | undefined;

  if (!q) {
    return res
      .status(400)
      .json({ errors: ["Não foi possivel realizar busca"] });
  }

  try {
    const posts = await Post.find({ text: new RegExp(q, "i") }).exec();
    if (posts.length > 0) {
      res.status(200).json(posts);
    } else {
      const usernames = await Post.find({
        username: new RegExp(q, "i"),
      }).exec();

      if (usernames.length > 0) {
        res.status(200).json(usernames);
      } else {
        const names = await Post.find({
          userRealName: new RegExp(q, "i"),
        }).exec();
        res.status(200).json(names);
      }
    }
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    res.status(500).json({ errors: ["Erro ao buscar posts.", error] });
  }
};

const getFollowingUsersPosts = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  const reqUser = req.user;
  const user = await User.findById(reqUser._id);
  if (!user) {
    res.status(404).json({ errors: ["Ocorreu um erro"] });
    return;
  }

  const followingUserIds = user.following.map(
    (followedUser) => followedUser.userId
  );

  const posts = await Post.find({ userId: { $in: followingUserIds } })
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(posts);
};

module.exports = {
  addPost,
  deletePost,
  getAllPosts,
  getUserPosts,
  likePost,
  commentPost,
  getPostById,
  getPostComments,
  searchPostAndUsers,
  getFollowingUsersPosts,
};
