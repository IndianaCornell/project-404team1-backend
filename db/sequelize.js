// db/sequelize.js
import "dotenv/config";
import { Sequelize } from "sequelize";

const {
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_PORT,
} = process.env;

const URL = `postgres://${encodeURIComponent(
  DATABASE_USERNAME
)}:${encodeURIComponent(
  DATABASE_PASSWORD
)}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}?sslmode=require`;

const sequelize = new Sequelize(URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30_000,
    idle: 10_000,
  },
});

export const connectDB = async () => {
  await sequelize.authenticate();
  console.log("✅ Database connection successful");
  await sequelize.sync();
};

export default sequelize;
