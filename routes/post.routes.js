import { Router } from "express";
import postController from "../controllers/post.controller.js";
import authenticate from "../middleware/authenticate.js";

const router = new Router();

router.post("/post/create", authenticate, postController.post);
router.get("/posts", postController.getAllPost);

export default router;
