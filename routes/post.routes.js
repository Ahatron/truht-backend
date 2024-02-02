import { Router } from "express";
import postController from "../controllers/post.controller.js";
import authenticate from "../middleware/authenticate.js";

const router = new Router();

router.post("/post", authenticate, postController.post);
router.get("/post/:id", postController.getPost);
router.get("/posts", postController.getPosts);
router.delete("/truncutate", postController.removeAll);
router.post("/post/like/:postId", authenticate, postController.likeToggle);
router.post("/post/comment/:postId", authenticate, postController.addComment);

export default router;
