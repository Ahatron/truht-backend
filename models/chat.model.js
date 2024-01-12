import { DataTypes } from "sequelize";
import db from "../db.js";

const Chat = db.define("Chat", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: true, // Для групповых чатов
  },
  type: {
    type: DataTypes.ENUM("personal", "group"),
    allowNull: false,
  },
});

export default Chat;
