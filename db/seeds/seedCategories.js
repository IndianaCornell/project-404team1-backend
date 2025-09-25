import "dotenv/config";
import sequelize from "../sequelize.js";
import Category from "../../models/category.js";

const categories = [
  "Seafood", "Lamb", "Starter", "Chicken", "Beef", "Dessert",
  "Vegan", "Pork", "Vegetarian", "Miscellaneous", "Pasta",
  "Breakfast", "Side", "Goat", "Soup"
];

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    for (const name of categories) {
      await Category.findOrCreate({ where: { name } });
    }

    console.log("✅ Categories seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding categories:", err.message);
    process.exit(1);
  }
})();
//щоб зробити таблицю на завантажити данні виконай node db/seeds/seedCategories.js
