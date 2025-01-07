import mongoose, { Types } from "mongoose";

//MARK comment 120 characters
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
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

export const ReviewsModle = mongoose.model("Reviews", ReviewsSchema);
