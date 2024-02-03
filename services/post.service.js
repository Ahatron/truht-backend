import Post, { Like, Comment } from "../models/post.model.js";
import User from "../models/user.model.js";
import File from "../models/file.model.js";

User.hasMany(Post, { as: "posts", foreignKey: "authorId" });
Post.belongsTo(User, {
  as: "author",
  foreignKey: "authorId",
  onDelete: "CASCADE",
});

User.hasMany(File, { as: "files" });
File.belongsTo(User);

Post.hasMany(File, { as: "files" });
File.belongsTo(Post, { onDelete: "CASCADE" });

Comment.hasMany(File, { as: "files" });
File.belongsTo(Comment, { onDelete: "CASCADE" });

User.hasMany(Like, { foreignKey: "userId", as: "likes" });
Like.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

Post.hasMany(Like, { foreignKey: "postId", as: "likes" });
Like.belongsTo(Post, { foreignKey: "postId", onDelete: "CASCADE" });

User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
Comment.belongsTo(User, { foreignKey: "userId", as: "author" });

Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });
Comment.belongsTo(Post, { foreignKey: "postId", onDelete: "CASCADE" });

Comment.hasMany(Like, { foreignKey: "commentId", as: "likes" });
Like.belongsTo(Comment, { foreignKey: "commentId", onDelete: "CASCADE" });

Comment.hasMany(Comment, { as: "answers", foreignKey: "parentId" });
Comment.belongsTo(Comment, { as: "parent", foreignKey: "parentId" });

class PostService {
  async post(text, files, userId) {
    console.log(text, files);
    if (!files?.length && files[0]?.keys().length && !text.length) {
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
        {
          model: File,
          required: false,
          attributes: ["id", "filename"],
          as: "files",
        },
        { model: User, required: true, attributes: ["nickname"], as: "author" },
        { model: Like, required: false, attributes: ["id"], as: "likes" },
        {
          model: Comment,
          required: false,
          as: "comments",
          include: [
            {
              model: User,
              attributes: ["nickname"],
              as: "author",
            },
            {
              model: Comment,
              required: false,
              order: [["createdAt", "DESC"]],
              as: "answers",
            },
            { model: Like, attributes: ["id"], required: false, as: "likes" },
          ],
        },
      ],
    });
    return post;
  }
  async getPost(postId) {
    return await Post.findOne({
      where: { id: postId },
      include: [
        {
          model: File,
          required: false,
          attributes: ["id", "filename"],
          as: "files",
        },
        { model: User, required: true, attributes: ["nickname"], as: "author" },
        { model: Like, required: false, attributes: ["id"], as: "likes" },
        {
          model: Comment,
          required: false,
          as: "comments",
          include: [
            {
              model: User,
              attributes: ["nickname"],
              as: "author",
            },
            {
              model: Comment,
              required: false,
              order: [["createdAt", "DESC"]],
              as: "answers",
            },
            { model: Like, attributes: ["id"], required: false, as: "likes" },
          ],
        },
      ],
    });
  }
  async removeAll() {
    return await Post.truncate({ cascade: true });
  }
  async likeToggle(postId, userId) {
    const post = await Post.findOne({ where: { id: postId } }),
      user = await User.findOne({ where: { id: userId } }),
      isLiked = await Like.findOne({ where: { contentId: postId, userId } });

    if (isLiked) {
      await isLiked.destroy();
    } else {
      const like = await Like.create({ postId, userId });

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
      throw "Cannot add comment without content";
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
  async addCommentAnswer(text, files, postId, userId, parentId) {
    if (
      !files?.length &&
      !Object.keys(files[0] || {}).length &&
      !text?.length
    ) {
      throw "Cannot add answer without content";
    }
    const user = await User.findOne({ where: { id: userId } }),
      post = await Post.findOne({ where: { id: postId } }),
      comment = await Comment.findOne({ where: { id: parentId } }),
      answer = await Comment.create({ text });

    if (files?.length && Object.keys(files[0]).length) {
      for (const { mimetype, destination, filename, size } of files) {
        const file = await File.create({
          filename,
          mimetype,
          path: destination,
          size,
        });
        await user.addFile(file);
        await answer.addFile(file);
      }
    }

    await comment.addAnswer(answer);
    await user.addComment(answer);
    await post.addComment(answer);
  }
  async getAnswers(parentId, postId) {
    return await Comment.findOne({
      where: { id: parentId, postId },
      attributes: null,
      include: [
        {
          model: Comment,
          required: true,
          order: [["createdAt", "DESC"]],
          as: "answers",
        },
      ],
    });
  }
  async commentLikeToggle(commentId, userId) {
    const comment = await Comment.findOne({ where: { id: commentId } }),
      user = await User.findOne({ where: { id: userId } }),
      isLiked = await Like.findOne({ where: { commentId, userId } });

    if (isLiked) {
      await isLiked.destroy();
    } else {
      const like = await Like.create({ commentId, userId });

      await comment.addLike(like);
      await user.addLike(like);
    }
  }
}

export default new PostService();
