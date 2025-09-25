import "dotenv/config";
import sequelize from "../sequelize.js";
import Area from "../../models/area.js";

const areas = [
  "Ukrainian","Italian","Moroccan","Unknown","Thai","Irish","British",
  "Japanese","French","Indian","American","Mexican","Malaysian","Dutch",
  "Spanish","Canadian","Vietnamese","Tunisian","Greek","Portuguese",
  "Croatian","Chinese","Egyptian","Jamaican","Polish","Kenyan","Turkish"
];

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    for (const name of areas) {
      await Area.findOrCreate({ where: { name } });
    }

    console.log("✅ Areas seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding areas:", err.message);
    process.exit(1);
  }
})();
//щоб зробити таблицю на завантажити данні виконай node db/seeds/seedAreas.js
