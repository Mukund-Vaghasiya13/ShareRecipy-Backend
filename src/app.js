import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import { UserRoute } from "./Routes/UserRoutes.js";

app.use("/api/v1/User", UserRoute);

import { RecipeRoute } from "./Routes/RecipesRoute.js";
app.use("/api/v1/Recipe", RecipeRoute);

app.get("/api/v1/", (req, res) => {
  res.send("Hello World");
});

export { app };
