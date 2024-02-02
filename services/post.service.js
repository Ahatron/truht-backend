import Post, { Like } from "../models/post.model.js";
import User from "../models/user.model.js";
import File from "../models/file.model.js";

User.hasMany(Post);
Post.belongsTo(User);

User.hasMany(File);
File.belongsTo(User);

Post.hasMany(File);
File.belongsTo(Post);

User.hasMany(Like, { foreignKey: "userId" });
Post.hasMany(Like, { foreignKey: "postId" });

Like.belongsTo(User, { foreignKey: "userId" });
Like.belongsTo(Post, { foreignKey: "postId" });

class PostService {
  async post(postData, postFiles, userId) {
    if (
      (!postFiles?.length || !Object.keys(postFiles[0]).length) &&
      !postData?.text.length
    ) {
      throw "Cannot creating post without content";
    }

    const user = await User.findOne({ where: { id: userId } }),
      post = await Post.create({ text: postData?.text });

    if (postFiles?.length && Object.keys(postFiles[0]).length) {
      for (const {
        type,
        mimetype,
        destination,
        name,
        filename,
        size,
      } of postFiles) {
        const createdFile = await File.create({
          filename: name || filename,
          mimetype: type || mimetype,
          path: destination,
          size,
        });
        await user.addFile(createdFile);
        await post.addFile(createdFile);
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
        { model: Like, required: false },
      ],
    });
    return post;
  }
  async removeAll() {
    return await Post.truncate({ cascade: true });
  }
  async likeToggle(postId, userId) {
    const post = await Post.findOne({ where: { id: postId } }),
      user = await User.findOne({ where: { id: userId } }),
      userLike = await Like.findOne({ where: { postId, userId } });

    if (userLike) {
      await userLike.destroy();
    } else if (post && user) {
      const like = await Like.create({ userId, postId });

      await post.addLike(like);
      await user.addLike(like);
    }
  }
}

export default new PostService();
