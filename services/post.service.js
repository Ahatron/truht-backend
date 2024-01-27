import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import File from "../models/file.model.js";

User.hasMany(Post);
Post.belongsTo(User);

User.hasMany(File);
File.belongsTo(User);

Post.hasMany(File);
File.belongsTo(Post);

class PostService {
  async post(postData, postFiles, userId) {
    const user = await User.findOne({ where: { id: userId } }),
      post = await Post.create(postData?.text ? { text: postData.text } : {});

    postFiles?.forEach(async ({ mimetype, destination, filename, size }) => {
      const createdFile = await File.create({
        filename,
        mimetype,
        path: destination,
        size,
      });
      await user.addFile(createdFile);
      await post.addFile(createdFile);
    });

    await user.addPost(post);
  }
  async getPosts() {
    return await Post.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        { model: File, required: false, attributes: ["id"] },
        { model: User, required: true, attributes: ["nickname"] },
      ],
    });
  }
  async removeAll() {
    return await Post.truncate({ cascade: true });
  }
}

export default new PostService();
