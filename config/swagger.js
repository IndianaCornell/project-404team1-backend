import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix для __dirname у ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Завантажуємо згенерований swagger.json
const swaggerPath = path.join(__dirname, "../docs/swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("✅ Swagger docs available at http://localhost:3000/api-docs");
};
