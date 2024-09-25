import express from "express";
const router = express.Router();

const {
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
} = require("../controllers/PostController");

import {
  addPostValidation,
  commentValidation,
} from "../middlewares/PostValidations";
import validate from "../middlewares/handleValidation";
import authGuard from "../middlewares/authGuard";

router.post("/", authGuard, addPostValidation(), validate, addPost);

router.delete("/:id", authGuard, deletePost);

router.get("/", authGuard, getAllPosts);

router.get("/search", searchPostAndUsers);

router.get("/following", authGuard, getFollowingUsersPosts);

router.get("/user/:id", authGuard, getUserPosts);

router.get("/:id", authGuard, getPostById);

router.get("/:id/comments", authGuard, getPostComments);

router.put("/like/:id", authGuard, likePost);

router.put(
  "/comment/:id",
  authGuard,
  commentValidation(),
  validate,
  commentPost
);

module.exports = router;
