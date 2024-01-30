import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const database = new Sequelize({
  database: "postgres",
  username: "postgres",
  password: process.env.DB_PASSWORD,
  host: "localhost",
  port: process.env.DB_PORT,
  dialect: "postgres",
});

export default database;
