// db/sequelize.js
import "dotenv/config";
import { Sequelize } from "sequelize";

const {
  DATABASE_DIALECT,
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_PORT,
} = process.env;

if (
  !DATABASE_DIALECT ||
  !DATABASE_NAME ||
  !DATABASE_USERNAME ||
  !DATABASE_HOST
) {
  throw new Error("DB env is incomplete. Need dialect/name/username/host.");
}

const sequelize = new Sequelize({
  dialect: DATABASE_DIALECT,
  database: DATABASE_NAME,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT) || 5432,
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
});

export const connectDB = async () => {
  await sequelize.authenticate();
  console.log("✅ Database connection successful");
  await sequelize.sync({ alter: true });
  console.log("✅ All models were synchronized successfully");
};

export default sequelize;
