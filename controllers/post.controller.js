import postService from "../services/post.service.js";
import { deleteFilesRecursively } from "../utils/file-system.utils.js";

const mediaPath = "./uploads/media";

class PostController {
  async post(req, res) {
    try {
      const files = req?.files || req.body?.files;
      if (files?.length > 6) {
        console.log(files);
        res.json({ message: "files no more than 6" }).status(409);
      }

      await postService.post(req.body, files, req.user.id);

      res.sendStatus(200);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }
  async getPosts(req, res) {
    try {
      const allPost = await postService.getPosts();

      res.json(allPost).status(200);
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
  async likeToggle(req, res) {
    try {
      await postService.likeToggle(req.body.postId, req.user.id);
      res.sendStatus(200);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }
}

export default new PostController();
