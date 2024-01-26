import { Router } from "express";
import fileController from "../controllers/file.controller.js";

const router = new Router();

router.get("/file/:fileId", fileController.getFile);

export default router;
