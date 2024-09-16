import mongoose, { Types } from "mongoose";

const ReviewsSchema = new mongoose.Schema(
  {
    userID: {
      type: Types.ObjectId,
      ref: "User",
    },
    recipeID: {
      type: Types.ObjectId,
      ref: "Recipes",
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const ReviewsModle = mongoose.model("Reviews", ReviewsSchema);
