import { Router } from "express";
import userController from "../controllers/user.controller.js";
import authenticate from "../middleware/authenticate.js";

const router = new Router();

router.post("/auth/register", userController.createUser);

router.post("/auth/login", userController.userLogin);

router.post("/auth/check-login", userController.checkLogin);

router.post("/auth/verify-token", authenticate, (_, res) => {
  res.sendStatus(200);
});

router.post("/auth/logout", authenticate, userController.logout);

router.get("/profile", authenticate, userController.getUserProfile);

export default router;
