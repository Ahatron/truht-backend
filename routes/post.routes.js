import { Router } from "express";
import postController from "../controllers/post.controller.js";
import authenticate from "../middleware/authenticate.js";

const router = new Router();

router.post("/posts", authenticate, postController.post);
router.get("/posts", postController.getAllPost);
router.delete("/truncutate", postController.removeAll);

export default router;
