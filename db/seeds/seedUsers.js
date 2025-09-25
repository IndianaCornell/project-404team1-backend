import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import sequelize from "../sequelize.js";
import User from "../../models/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, "../users.json");

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const raw = fs.readFileSync(jsonPath, "utf-8");
    const input = JSON.parse(raw);

    const rows = input.map((u) => ({
      id: u._id?.$oid ?? u._id,
      name: u.name,
      avatar: u.avatar,
      email: u.email,
      followers: u.followers || [],
      following: u.following || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await User.bulkCreate(rows, { ignoreDuplicates: true });

    console.log(`✅ Seeded users: ${rows.length}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding users:", err);
    process.exit(1);
  }
})();
//щоб зробити таблицю на завантажити данні виконай node db/seeds/seedUsers.js
