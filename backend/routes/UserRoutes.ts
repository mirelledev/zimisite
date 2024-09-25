import express from "express";
const {
  register,
  login,
  getUserById,
  getCurrentUser,
  update,
  followUser,
  deleteUser,
} = require("../controllers/UserController");
import validate from "../middlewares/handleValidation";
import {
  userCreateValidation,
  loginUserValidation,
  userUpdateValidation,
} from "../middlewares/userValidations";
import authGuard from "../middlewares/authGuard";

const { imageUpload } = require("../middlewares/imageUpload");

const router = express.Router();

router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginUserValidation(), validate, login);

router.delete("/", authGuard, deleteUser);

router.get("/profile", authGuard, getCurrentUser);

router.put(
  "/",
  authGuard,
  userUpdateValidation(),
  validate,
  imageUpload.single("profileImage"),
  update
);

router.put("/:id", authGuard, followUser);

router.get("/:id", getUserById);

module.exports = router;
