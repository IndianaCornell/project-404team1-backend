import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "../sequelize.js";
import Recipe from "../../models/recipe.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_OWNER_ID = "00000000-0000-0000-0000-000000000000";

function extractOwner(o) {
  if (o == null) return null;
  if (typeof o === "string" || typeof o === "number") return String(o);
  // типові варіанти з Mongo / довільних структур:
  if (o.$oid) return String(o.$oid);
  if (o._id?.$oid) return String(o._id.$oid);
  if (o._id) return String(o._id);
  if (o.id) return String(o.id);
  return null; // не змогли витягти
}

async function seedRecipes() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("✅ DB connected");

    const dataPath = path.join(__dirname, "../recipes.json");
    const raw = fs.readFileSync(dataPath, "utf-8");
    const recipes = JSON.parse(raw);

    for (const r of recipes) {
const ownerStr = extractOwner(r.owner) ?? DEFAULT_OWNER_ID;

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
        owner: ownerStr,

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
