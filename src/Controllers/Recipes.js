import { asyncHandler } from "../utils/AsyncHandler.js";
import { CustomError } from "../utils/CustomErrorClass.js";
import { RecipesModle } from "../Modles/Recipes.js";
import { User } from "../Modles/UserModle.js";
import fs from "fs";
import { uplodeCloudanry } from "../utils/CloudnaryImageUplode.js";
import { Console } from "console";

const createRecipes = asyncHandler(async (req, res) => {
  // get recipes image
  const FileMetaData = req.file;
  //get fields value
  const { title, description, ingredients, instructions } = req.body;
  // check all the fileds
  if ([title, description, ingredients, instructions].some((e) => !e)) {
    await fs.promises.unlink(FileMetaData.path);
    throw new CustomError("", "Fields are empety Or image uplode problem", 400);
  }

  //check user is login or not
  const user = req.user;
  if (!user) {
    throw new CustomError("", "Invalid User or server Error", 401);
  }

  const validUser = await User.findById(user._id);
  if (!validUser) {
    throw new CustomError("", "Invalid User", 401);
  }

  // uplode image On cloudnary
  const result = await uplodeCloudanry(FileMetaData.path);
  if (!result) {
    throw new CustomError("", "Fail To uplode image on cloud", 400);
  }
  //store all the information about recipes and create new recipes
  const createRecipe = await RecipesModle.create({
    userId: user._id,
    title,
    image: result.secure_url,
    description,
    ingredients,
    instructions,
  });

  if (!createRecipe) {
    throw new CustomError("", "Fail to create Recipes", 400);
  }

  return res.sendStatus(201);
});

const ListUserRecipe = asyncHandler(async (req, res) => {
  const user = req.user;
  const { page } = req.query;
  //TODO:
  //Using Id List acording To Page Recipes
  //Return that as List
});
export { createRecipes };
