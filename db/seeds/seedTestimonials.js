import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import sequelize from "../sequelize.js";
import Testimonial from "../../models/testimonial.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, "../testimonials.json");

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const raw = fs.readFileSync(jsonPath, "utf-8");
    const input = JSON.parse(raw);

    const rows = input.map((it) => ({
      id: it?._id?.$oid ?? it?._id ?? cryptoRandom(),
      ownerId: it?.owner?.$oid ?? it?.owner ?? null,
      testimonial: it?.testimonial ?? "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await Testimonial.bulkCreate(rows, { ignoreDuplicates: true });

    console.log(`✅ Seeded testimonials: ${rows.length}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding testimonials:", err);
    process.exit(1);
  }
})();

function cryptoRandom() {
  return "tmp_" + Math.random().toString(36).slice(2);
}
//щоб зробити таблицю на завантажити данні виконай node db/seeds/seedTestimonials.js

