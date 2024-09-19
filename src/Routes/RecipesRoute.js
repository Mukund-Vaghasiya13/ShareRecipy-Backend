import { Router } from "express";
import { upload } from "../Middlewares/MulterImageUplode.js";
import { verifyUser } from "../Middlewares/CheckUserIsValidOrNot.js";

const router = Router();

import { createRecipes } from "../Controllers/Recipes.js";
router
  .route("/createRecipes")
  .post(verifyUser, upload.single("RecipesImage"), createRecipes);

export const RecipeRoute = router;
