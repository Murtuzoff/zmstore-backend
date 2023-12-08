import { Sequelize } from "sequelize";
import pg from "pg";

const sequelize = new Sequelize(
  process.env.DB_NAME, // база данных
  process.env.DB_USER, // пользователь
  process.env.DB_PASS, // пароль
  {
    dialect: "postgres",
    dialectModule: pg,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
  }
);

export default sequelize;
