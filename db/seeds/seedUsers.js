import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

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

    // формуємо масив для bulkCreate
    const rows = await Promise.all(
      input.map(async (u) => {
        const id = u._id?.$oid ?? u._id;
        const hashedPassword = await bcrypt.hash("123", 10);

        return {
          id,
          name: u.name,
          avatar: u.avatar || `https://i.pravatar.cc/150?u=${id}`,
          email: u.email,
          followers: u.followers || [],
          following: u.following || [],
          favorites: [],
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );

    await User.bulkCreate(rows, { ignoreDuplicates: true });

    console.log(`✅ Seeded users: ${rows.length}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding users:", err);
    process.exit(1);
  }
})();

//щоб зробити таблицю на завантажити данні виконай node db/seeds/seedUsers.js