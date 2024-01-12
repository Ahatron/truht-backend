import Chat from "../models/chat.model";
import User from "../models/user.model";

class ChatService {
  async createPersonalChat(userId1, userId2) {
    // Создаем чат в базе данных
    const chat = await Chat.create({ type: "personal" });

    // Получаем экземпляры пользователей по их идентификаторам
    const user1 = await User.findByPk(userId1);
    const user2 = await User.findByPk(userId2);

    // Добавляем связи между чатом и пользователями
    await chat.addUser(user1);
    await chat.addUser(user2);

    return chat; // Возвращаем созданный чат
  }
  async createGroupChat(ownerId, participants) {
    const chat = await Chat.create({ ownerId, type: "group" });
  }
}
