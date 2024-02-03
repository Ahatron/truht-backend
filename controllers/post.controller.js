import postService from "../services/post.service.js";
import { deleteFilesRecursively } from "../utils/file-system.utils.js";

const mediaPath = "./uploads/media";

class PostController {
  async post(req, res) {
    try {
      if (req?.files.length > 6) {
        res.json({ message: "files no more than 6" }).status(409);
      }

      await postService.post(req.body.text, req.files, req.user.id);

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
  async getPost(req, res) {
    try {
      const post = await postService.getPost(req.params.id);
      res.json(post).status(200);
    } catch (e) {
      console.error("Error getting post: \n", e);
      res.status(500);
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
      await postService.likeToggle(req.params.postId, req.user.id);
      res.sendStatus(200);
    } catch (e) {
      console.error("Like error: \n", e.original);
      res.sendStatus(500);
    }
  }
  async addComment(req, res) {
    try {
      await postService.addComment(
        req.body.text,
        req.files,
        req.params.postId,
        req.user.id
      );
      res.json({ message: "Comment is added" }).status(200);
    } catch (e) {
      console.error("Comment add error: \n", e);
      res.json({ message: "Comment add error" }).status(500);
    }
  }
  async addCommentAnswer(req, res) {
    try {
      await postService.addComment(
        req.body.text,
        req.files,
        req.params.postId,
        req.user.id,
        req.params.commentId
      );
      res.json({ message: "Answer is added" }).status(200);
    } catch (e) {
      console.error("Answer add error: \n", e);
      res.json({ message: "Answer add error" }).status(500);
    }
  }
  async getAnswers(req, res) {
    try {
      const answers = await postService.getAnswers(
        req.params.commentId,
        req.params.postId
      );

      res.json(answers).status(200);
    } catch (e) {
      console.error("Get comment error: \n", e);
      res.json({ message: "Get comment error" }).status(500);
    }
  }
  async commentLikeToggle(req, res) {
    try {
      await postService.commentLikeToggle(req.params.commentId, req.user.id);
      res.sendStatus(200);
    } catch (e) {
      console.error("Comment liking error: \n", e);
      res.json("Comment liking error").status(500);
    }
  }
}

export default new PostController();
