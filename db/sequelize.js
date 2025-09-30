// db/sequelize.js
import "dotenv/config";
import { Sequelize } from "sequelize";

const {
  // головні змінні для підключення
  DATABASE_URL,
  DATABASE_DIALECT = "postgres",
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOST = "localhost",
  DATABASE_PORT = "5432",
  NODE_ENV = "development",
} = process.env;

const isProd = NODE_ENV === "production";
let sequelize;

// ✅ Підтримка DATABASE_URL (напр. Render/Heroku). У проді вмикаємо SSL.
if (DATABASE_URL) {
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: isProd
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
  });
} else {
  // ✅ Явне підключення за полями
  const required = ["DATABASE_NAME", "DATABASE_USERNAME", "DATABASE_HOST"];
  const missing = required.filter((k) => !process.env[k]);
  if (DATABASE_DIALECT !== "postgres") {
    throw new Error(
      `Set DATABASE_DIALECT=postgres in .env for Postgres setup.`
    );
  }
  if (missing.length) {
    throw new Error(
      `DB env is incomplete. Missing: ${missing.join(", ")}. ` +
        `Required: DATABASE_NAME / DATABASE_USERNAME / DATABASE_HOST.`
    );
  }

  sequelize = new Sequelize(
    DATABASE_NAME,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    {
      host: DATABASE_HOST,
      port: Number(DATABASE_PORT) || 5432,
      dialect: "postgres",
      logging: false,
      dialectOptions: isProd
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
      // опційно: пул з’єднань
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    }
  );
}

// 👉 Підключення + синхронізація моделей.
// Якщо у вас є міграції — можна прибрати { alter: true }.
export const connectDB = async () => {
  await sequelize.authenticate();
  console.log("✅ Database connection successful");
  await sequelize.sync({ alter: true });
  console.log("✅ All models were synchronized successfully");
};

export default sequelize;
