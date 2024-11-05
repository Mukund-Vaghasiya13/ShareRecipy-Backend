import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../Modles/UserModle.js";
import { CustomError } from "../utils/CustomErrorClass.js";
import {
  uplodeCloudanry,
  removeProfileImage,
} from "../utils/CloudnaryImageUplode.js";
import fs from "fs";

const RegisterUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if ([email, username, password].some((e) => e === "" || e === null)) {
    throw new CustomError("", "All Fields are Required", 400);
  }

  const userExist = await User.findOne({ $or: [{ username }, { email }] });
  if (userExist) {
    throw new CustomError("", "username or Email already in use", 409);
  }

  const newUser = await User.create({ username, email, password });
  if (!newUser) {
    throw new CustomError("", "Fail to register User", 500);
  }

  const token = newUser.generateResponseToken();
  if (!token) {
    throw new CustomError("", "Fail to Genrate Token", 500);
  }

  newUser.password = undefined;
  return res
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: true,
    })
    .status(201)
    .json({
      Logintoken: token,
      message: "Login Successfull",
      statusCode: 201,
      user: newUser,
    });
});

const LoginUser = asyncHandler(async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });

  if (!user) {
    throw new CustomError("", "User is not Registerd", 500);
  }

  if (!(await user.isPasswordCorrect(password))) {
    throw new CustomError("", "Fail To Authenticate", 500);
  }

  const token = user.generateResponseToken();
  if (!token) {
    throw new CustomError("", "Fail to Genrate Token", 500);
  }

  user.password = undefined;
  return res
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: true,
    })
    .status(201)
    .json({
      Logintoken: token,
      message: "Login Successfull",
      statusCode: 201,
      user,
    });
});

const ChangeUsernameOrEmail = asyncHandler(async (req, res) => {
  const loginUserDetails = req.user;
  const FilePath = req.file ?? null;
  const { username, email } = req.body;

  if (!loginUserDetails) {
    if (FilePath) {
      await fs.promises.unlink(FilePath.path);
    }
    throw new CustomError("", "Invalid Token Details", 401);
  }

  const validUser = await User.findById(loginUserDetails._id).select(
    "-password"
  );

  if (!validUser) {
    if (FilePath) {
      await fs.promises.unlink(FilePath.path);
    }
    throw new CustomError("", "Invalid User", 401);
  }

  if (FilePath) {
    const result = await uplodeCloudanry(FilePath.path);
    if (!result) {
      await fs.promises.unlink(FilePath.path);
      throw new CustomError("", "Fail to upload Image to Cloud", 401);
    }
    validUser.profilePicture = result.secure_url;
  }

  // Only update fields if they are provided
  if (username) validUser.username = username;
  if (email) validUser.email = email;

  const updateUser = await validUser.save({ validateBeforeSave: false });
  return res.status(201).json({
    ...updateUser._doc,
  });
});

// // MARK: To be Done later
// const loguotUser = asyncHandler(async (req, res) => {
//   const user = req.user;
//   if (!user) {
//     throw new CustomError("", "Invalid User", 401);
//   }

// });

export { RegisterUser, LoginUser, ChangeUsernameOrEmail };
