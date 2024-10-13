import { asyncHandler } from "../utils/AsyncHandler.js";
import { RecipesModle } from "../Modles/Recipes.js";
import { CustomError } from "../utils/CustomErrorClass.js";

const listRecipes = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new CustomError("", "Login Token Expire", 401);
  }

  const queryParam = req.query;

  if (!queryParam.page) {
    throw new CustomError("", "Specify the page Count!", 500);
  }

  const page = parseInt(queryParam.page);
  const limit = 10;
  const skip = (page - 1) * limit;

  const recipes = await RecipesModle.find().skip(skip).limit(limit);
  if (!recipes) {
    throw new CustomError("", "Unable To fetch Recipy", 500);
  }

  return res.status(200).json({
    user: user,
    recipe: recipes,
  });
});

export { listRecipes };
