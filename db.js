import { Sequelize } from "sequelize";

const database = new Sequelize({
  database: "postgres",
  username: "postgres",
  password: "1A1a9a0e",
  host: "localhost",
  port: 5432,
  dialect: "postgres",
});

export default database;
