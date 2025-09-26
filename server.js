import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./db/sequelize.js";

const PORT = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
    console.log(
      `📖 Swagger docs available at http://localhost:${PORT}/api-docs`
    );
  } catch (e) {
    console.error("❌ Failed to start:", e);
    process.exit(1);
  }
};
start();
