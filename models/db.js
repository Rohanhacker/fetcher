import { Sequelize } from "sequelize";

const dbPath = new URL('database.sqlite', import.meta.url).pathname

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
});

