import { Router, Request, Response } from "express";

const userRoutes = require("./UserRoutes");
const postRoutes = require("../routes/PostRoutes");

const router = Router();

router.use("/api/users", userRoutes);
router.use("/api/posts", postRoutes);

router.get("/", (req: Request, res: Response) => {
  res.send("api working");
});

export default router;
