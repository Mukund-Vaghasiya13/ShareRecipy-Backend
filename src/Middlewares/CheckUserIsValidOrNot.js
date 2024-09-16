import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/CustomErrorClass.js";
import { User } from "../Modles/UserModle.js";

export const verifyUser = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new CustomError("", "Token Expire Login Again", 401);
    }

    const decodedToken = jwt.verify(token, " RecipesReviewAppMukund@13:2024");

    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user) {
      throw new CustomError("", "Invalid Access Token", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    throw new CustomError(error?.message ?? "", "Fail to varefiy user", 401);
  }
});
