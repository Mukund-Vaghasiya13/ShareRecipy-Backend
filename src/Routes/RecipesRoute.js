import { Router } from "express";
import { upload } from "../Middlewares/MulterImageUplode.js";
import { verifyUser } from "../Middlewares/CheckUserIsValidOrNot.js";

const router = Router();

import { createRecipes } from "../Controllers/Recipes.js";
import { listRecipes } from "../Controllers/HomeScreen.js";
router
  .route("/createRecipes")
  .post(verifyUser, upload.single("RecipesImage"), createRecipes);

router.route("/list").get(verifyUser, listRecipes);

export const RecipeRoute = router;
