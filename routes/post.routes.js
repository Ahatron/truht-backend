import { Router } from "express";
import postController from "../controllers/post.controller.js";
import authenticate from "../middleware/authenticate.js";

const router = new Router();

router.post("/post", authenticate, postController.post);
router.get("/post/:id", postController.getPost);
router.get("/posts", postController.getPosts);
router.delete("/truncutate", postController.removeAll);
router.post("/post/:postId/like", authenticate, postController.likeToggle);
router.post("/post/:postId/comment", authenticate, postController.addComment);
router.post(
  "/post/:postId/comment/:commentId/answer",
  authenticate,
  postController.addCommentAnswer
);
router.get(
  "/post/:postId/comment/:commentId/answers",
  postController.getAnswers
);
router.post(
  "/post/comment/:commentId/like",
  authenticate,
  postController.commentLikeToggle
);

export default router;
