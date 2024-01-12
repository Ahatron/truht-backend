import User from "./models/user.model.js";
import Message from "./models/message.model.js";
import Chat from "./models/chat.model.js";
import File from "./models/file.model.js";

// Chats
Chat.belongsTo(User, { foreignKey: "ownerId", as: "owner" });
Chat.belongsToMany(User, { through: "UserChat", as: "users" });
Chat.hasMany(Message);

Message.belongsTo(User);
Message.belongsTo(Chat);

User.belongsToMany(Chat, { through: "UserChat" });
User.hasMany(Message);

// Files

File.belongsTo(User, { foreignKey: "userId" }); // Определение отношения: файл принадлежит пользователю
User.hasMany(File, { foreignKey: "userId" });
