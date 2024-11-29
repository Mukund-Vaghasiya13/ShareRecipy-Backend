import mongoose, { Types } from "mongoose";

const RecipesSchema = new mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    ingredients: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const RecipesModle = mongoose.model("Recipes", RecipesSchema);
