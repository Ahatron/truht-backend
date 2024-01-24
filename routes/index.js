import post from "./post.routes.js";
import user from "./user.routes.js";
import { Router } from "express";

const router = new Router();

router.use(post).use(user);

export default router;
