import { Router } from "express";
import { upload } from "../Middlewares/MulterImageUplode.js";
import { verifyUser } from "../Middlewares/CheckUserIsValidOrNot.js";

const router = Router();

import {
  createRecipes,
  listRecipesOfParticularUser,
  DeleteRecipes,
  listRecipes,
} from "../Controllers/Recipes.js";

router
  .route("/createRecipes")
  .post(verifyUser, upload.single("RecipesImage"), createRecipes);

router.route("/list").get(verifyUser, listRecipes);
router.route("/list/user").get(verifyUser, listRecipesOfParticularUser);
router.route("/list/user/delete").post(verifyUser, DeleteRecipes);

export const RecipeRoute = router;
