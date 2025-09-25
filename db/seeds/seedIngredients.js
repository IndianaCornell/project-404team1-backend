import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "../sequelize.js";
import Ingredient from "../../models/ingredient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, "../ingredients.json");

const seedIngredients = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("✅ Connected to DB");

    // прочитати JSON
    const rawData = fs.readFileSync(jsonPath);
    const ingredients = JSON.parse(rawData);

    // додати в базу
    for (const ing of ingredients) {
      await Ingredient.upsert({
        id: ing._id,
        name: ing.name,
        desc: ing.desc,
        img: ing.img,
      });
    }

    console.log("✅ Ingredients seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding ingredients:", err);
    process.exit(1);
  }
};

seedIngredients();

//щоб зробити таблицю на завантажити данні виконай node db/seeds/seedIngredients.js
