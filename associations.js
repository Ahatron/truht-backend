import User from "./models/user.model.js";
import Message from "./models/message.model.js";
import Chat from "./models/chat.model.js";
import File from "./models/file.model.js";
import Post, { Like, Comment } from "./models/post.model.js";

// Chats
Chat.belongsTo(User, { foreignKey: "ownerId", as: "owner" });
Chat.belongsToMany(User, { through: "UserChat", as: "users" });
User.belongsToMany(Chat, { through: "UserChat" });

Chat.hasMany(Message);
Message.belongsTo(Chat);

User.hasMany(Message);
Message.belongsTo(User);
// Files
// Определение отношения: файл принадлежит пользователю

// Post

Post.belongsToMany(User, { through: Like });
User.belongsToMany(Post, { through: Like });
Post.belongsToMany(User, { through: File });
User.belongsToMany(Post, { through: File });

User.hasMany(Comment);
Comment.belongsTo(User);

Post.hasMany(Comment);
Comment.belongsTo(Post);

Post.belongsToMany(User, { through: Comment });
User.belongsToMany(Post, { through: Comment });
