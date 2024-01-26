import postService from "../services/post.service.js";
import fs from "fs/promises";
import { glob } from "glob";
import { deleteFilesRecursively } from "../utils/file-system.utils.js";

const mediaPath = "./uploads/media";

class PostController {
  async post(req, res) {
    try {
      const files = req.files;
      console.log(req.files);
      await postService.post(req.body, files, req.user.id);

      res.sendStatus(200);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }
  async getAllPost(req, res) {
    try {
      const allPost = await postService.getAllPost();

      res.send(allPost).status(200);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }
  async removeAll(_, res) {
    try {
      await postService.removeAll();
      deleteFilesRecursively(mediaPath);
      res.sendStatus(200);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }
}

export default new PostController();
