import User from "../models/User";
import jwt from "jsonwebtoken";
const jwtSecret = process.env.JWT_SECRET;
import { IGetUserAuthInfoRequest } from "../@types/express";
import { Response, NextFunction } from "express";

const authGuard = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ errors: ["Acesso negado."] });
  }

  try {
    const verified = jwt.verify(token, jwtSecret!);
    if (typeof verified !== "string" && verified.id) {
      req.user = await User.findById(verified.id).select("-password");

      next();
    }
  } catch (error) {
    res.status(401).json({ errors: ["Token inválido"] });
  }
};

export default authGuard;
