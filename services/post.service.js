import Post, { Like, Comment } from "../models/post.model.js";
import User from "../models/user.model.js";
import File from "../models/file.model.js";

User.hasMany(Post);
Post.belongsTo(User);

User.hasMany(File);
File.belongsTo(User);

Post.hasMany(File);
File.belongsTo(Post);

Comment.hasMany(File);
File.belongsTo(Comment);

User.hasMany(Like, { foreignKey: "userId" });
Post.hasMany(Like, { foreignKey: "contentId" });

Like.belongsTo(User, { foreignKey: "userId" });
Like.belongsTo(Post, { foreignKey: "contentId" });

User.hasMany(Comment, { foreignKey: "userId" });
Post.hasMany(Comment, { foreignKey: "postId" });

Comment.hasMany(Like, { foreignKey: "userId" });
Like.belongsTo(Comment, { foreignKey: "contentId" });

Comment.belongsTo(User, { foreignKey: "userId" });
Comment.belongsTo(Post, { foreignKey: "postId" });

class PostService {
  async post(postData, userId) {
    const { text, files } = postData;
    if (!files?.length && !Object.keys(files[0]).length && !text.length) {
      throw "Cannot creating post without content";
    }

    const user = await User.findOne({ where: { id: userId } }),
      post = await Post.create({ text });

    if (files?.length && Object.keys(files[0]).length) {
      for (const { mimetype, destination, filename, size } of files) {
        const file = await File.create({
          filename,
          mimetype,
          path: destination,
          size,
        });
        await user.addFile(file);
        await post.addFile(file);
      }
    }

    await user.addPost(post);
  }
  async getPosts() {
    const post = await Post.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        { model: File, required: false, attributes: ["id", "filename"] },
        { model: User, required: true, attributes: ["nickname"] },
        { model: Like, required: false, attributes: ["id"] },
        { model: Comment, required: false },
      ],
    });
    return post;
  }
  async getPost(postId) {
    return Post.findOne({
      where: { id: postId },
      include: [
        { model: File, required: false, attributes: ["id", "filename"] },
        { model: User, required: true, attributes: ["nickname"] },
        { model: Like, required: false, attributes: ["id"] },
        { model: Comment, required: false },
      ],
    });
  }
  async removeAll() {
    return await Post.truncate({ cascade: true });
  }
  async likeToggle(postId, userId) {
    const post = await Post.findOne({ where: { id: postId } }),
      user = await User.findOne({ where: { id: userId } }),
      userLike = await Like.findOne({ where: { contentId: postId, userId } });

    if (userLike) {
      await userLike.destroy();
    } else if (post && user) {
      const like = await Like.create({ contentId: postId, postId });

      await post.addLike(like);
      await user.addLike(like);
    }
  }
  async addComment(text, files, postId, userId) {
    if (
      !files?.length &&
      !Object.keys(files[0] || {}).length &&
      !text?.length
    ) {
      throw "Cannot creating post without content";
    }
    const user = await User.findOne({ where: { id: userId } }),
      post = await Post.findOne({ where: { id: postId } }),
      comment = await Comment.create({ text });

    if (files?.length && Object.keys(files[0]).length) {
      for (const { mimetype, destination, filename, size } of files) {
        const file = await File.create({
          filename,
          mimetype,
          path: destination,
          size,
        });
        await user.addFile(file);
        await comment.addFile(file);
      }
    }
    await user.addComment(comment);
    await post.addComment(comment);
  }
}

export default new PostService();
