import { asyncHandler } from "../utils/AsyncHandler.js";
import { CustomError } from "../utils/CustomErrorClass.js";
import { RecipesModle } from "../Modles/Recipes.js";
import { User } from "../Modles/UserModle.js";
import fs from "fs";
import { uplodeCloudanry } from "../utils/CloudnaryImageUplode.js";

const createRecipes = asyncHandler(async (req, res) => {
  // get recipes image
  const FileMetaData = req.file;
  //get fields value
  const { title, description, ingredients } = req.body;
  // check all the fileds
  if ([title, description, ingredients].some((e) => !e)) {
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
  });

  if (!createRecipe) {
    throw new CustomError("", "Fail to create Recipes", 400);
  }

  return res.status(201).json(createRecipe);
});

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
  return res.status(200).json(recipes);
});

const listRecipesOfParticularUser = asyncHandler(async (req, res) => {
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

  const recipes = await RecipesModle.find({ userId: user._id })
    .skip(skip)
    .limit(limit);

  if (!recipes) {
    throw new CustomError("", "Unable To fetch Recipy", 500);
  }
  return res.status(200).json(recipes);
});

const DeleteRecipes = asyncHandler(async (req, res) => {
  const user = req.user;
  const { _id } = req.body;

  if (!user) {
    throw new CustomError("", "Login Token Expire", 401);
  }

  if (!_id) {
    throw new CustomError("", "Field is Empety", 400);
  }

  const validUser = await User.findById(user._id);

  if (!validUser) {
    throw new CustomError("", "Invalid User", 401);
  }

  const recipe = await RecipesModle.findByIdAndDelete(_id);

  if (!recipe) {
    throw new CustomError("", "Fail To delete", 401);
  }

  //TODO: Send Message
  return res.status(201).json({
    message: "Delete Successfull",
    statusCode: 201,
  });
});

//TODO: UpdateRecipes

export {
  createRecipes,
  listRecipes,
  listRecipesOfParticularUser,
  DeleteRecipes,
};
