import postService from "../services/post.service.js";
import fs from "fs/promises";
import { glob } from "glob";

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

      for (const post of allPost) {
        for (let file of post.Files) {
          try {
            file.file = await fs.readFile(file.path + "/" + file.filename);
            file.dongan = "ho ho, nokataru noka";
          } catch (error) {
            console.error("Ошибка при чтении файла:", error);
            file.file = null; // Укажите значение по умолчанию при ошибке
          }
        }
      }

      res.json(allPost).status(200);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }
}

export default new PostController();
