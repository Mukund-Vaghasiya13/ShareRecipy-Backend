import mongoose, { Types } from "mongoose";

const LikesSchema = new mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
    recipeID: {
      type: Types.ObjectId,
      ref: "Recipes",
    },
  },
  { timestamps: true }
);

export const Likes = mongoose.model("Likes", LikesSchema);
