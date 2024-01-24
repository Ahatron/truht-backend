import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import File from "../models/file.model.js";

User.hasMany(Post);
Post.belongsTo(User);

Post.hasMany(File);
File.belongsTo(Post);

class PostService {
  async post(postData, postFiles, userId) {
    const user = await User.findOne({ where: { id: userId } }),
      post = await Post.build(postData?.text ? { text: postData.text } : {});
    if (postFiles) {
      const files = await File.build(postFiles);
      await post.addFiles(files);
    }

    await user.addPost(post);
  }
  async getAllPost() {
    return await Post.findAll({
      include: {
        model: File,
        required: false, // Это говорит Sequelize использовать left join
      },
    });
  }
}

export default new PostService();
