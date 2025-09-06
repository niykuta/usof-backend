import express from "express";

import { authRouter } from "./auth.router.js";
import { userRouter } from "./user.router.js";
import { postRouter } from "./post.router.js";
import { commentRouter } from "./comment.router.js";
import { categoryRouter } from "./category.router.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/posts", postRouter);
router.use("/categories", categoryRouter);
router.use("/comments", commentRouter);

export { router };