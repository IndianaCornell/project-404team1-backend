import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "../sequelize.js";
import Recipe from "../../models/recipe.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedRecipes() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("✅ DB connected");

    const dataPath = path.join(__dirname, "../recipes.json");
    const raw = fs.readFileSync(dataPath, "utf-8");
    const recipes = JSON.parse(raw);

    for (const r of recipes) {
      await Recipe.create({
        title: r.title,
        category: r.category,
        area: r.area,
        instructions: r.instructions,
        description: r.description,
        thumb: r.thumb,
        time: r.time,
        createdAt: new Date(parseInt(r.createdAt?.$date?.$numberLong ?? Date.now())),
        updatedAt: new Date(parseInt(r.updatedAt?.$date?.$numberLong ?? Date.now())),
      });
    }

    console.log("🌱 Recipes seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding recipes:", err);
    process.exit(1);
  }
}

seedRecipes();
//щоб зробити таблицю на завантажити данні виконай node db/seeds/seedRecipes.js
