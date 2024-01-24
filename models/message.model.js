import { DataTypes } from "sequelize";
import db from "../db.js";

const Message = db.define(
  "Message",
  {
    msg_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { timestamps: true }
);

export default Message;
