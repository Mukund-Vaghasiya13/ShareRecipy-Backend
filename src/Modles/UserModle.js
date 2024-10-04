import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      unique: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.isPasswordCorrect = async function (password) {
  let result = await bcrypt.compare(password, this.password);
  return result;
};

UserSchema.methods.generateResponseToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    "RecipesReviewAppMukund@13:2024"
  );
};

export const User = mongoose.model("User", UserSchema);
