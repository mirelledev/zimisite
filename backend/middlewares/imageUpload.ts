const multer = require("multer");
import { FileFilterCallback } from "multer";
const path = require("path");
import { Request, Response, NextFunction } from "express";

const imageStorage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    let folder = "";

    if (req.baseUrl.includes("users")) {
      folder = "users";
    } else if (req.baseUrl.includes("posts")) {
      folder = "posts";
    }
    cb(null, `uploads/${folder}/`);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    if (!file.originalname.match(/\.(png|jpg|jfif)$/)) {
      return cb(new Error("Por favor, envie imagens apenas em PNG ou JPG"));
    }

    cb(null, true);
  },
});

module.exports = {
  imageUpload,
};
