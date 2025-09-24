import express from "express";
import morgan from "morgan";
import cors from "cors";

import "dotenv/config";
import "./db/sequelize.js";

import authRouter from "./routes/authRouter.js";
// import userRouter from "./routes/usersRouter.js";
// import categoryRouter from "./routes/categoriesRouter.js";
// import areasRouter from "./routes/areasRouter.js";
// import ingredientRouter from "./routes/ingredientsRouter.js";
// import testimonialRouter from "./routes/testimonialsRouter.js";
// import recipeRouter from "./routes/recipesRouter.js";

import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
// app.use("/api/users", userRouter);
// app.use("/api/categories", categoryRouter);
// app.use("/api/areas", areasRouter);
// app.use("/api/ingredients", ingredientRouter);
// app.use("/api/testimonials", testimonialRouter);
// app.use("/api/recipes", recipeRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
