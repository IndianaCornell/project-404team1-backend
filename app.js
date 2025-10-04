import express from "express";
import morgan from "morgan";
import cors from "cors";

import "dotenv/config";

import authRouter from "./routes/authRouter.js";
import usersRouter from "./routes/usersRouter.js";
import categoriesRouter from "./routes/categoriesRouter.js";
import areasRouter from "./routes/areasRouter.js";
import ingredientRouter from "./routes/ingredientsRouter.js";
import testimonialRouter from "./routes/testimonialsRouter.js";
import recipesRouter from "./routes/recipesRouter.js";
import favoritesRouter from "./routes/favoritesRouter.js";

import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

import { swaggerDocs } from "./config/swagger.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/areas", areasRouter);
app.use("/api/ingredients", ingredientRouter);
app.use("/api/testimonials", testimonialRouter);
app.use("/api/recipes", recipesRouter);
app.use("/api/favorites", favoritesRouter);

// Swagger docs
swaggerDocs(app);

app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
