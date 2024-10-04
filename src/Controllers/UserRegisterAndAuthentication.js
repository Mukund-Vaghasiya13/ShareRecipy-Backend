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
    });
});

const LoginUser = asyncHandler(async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });

  console.log(user);

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
    });
});

const UplodeOrChangeUsername = asyncHandler(async (req, res) => {
  const FilePath = req.file ?? null;
  //MARK: Debug
  //console.log(file);
  const loginUserDetails = req.user;
  const { username } = req.body;
  console.log(req.body);

  if (!FilePath) {
    throw new CustomError("", "File Uplode Fail", 400);
  }

  if (!username) {
    await fs.promises.unlink(FilePath.path);
    throw new CustomError("", "File Uplode Fail", 400);
  }

  if (!loginUserDetails) {
    await fs.promises.unlink(FilePath.path);
    throw new CustomError("", "Invalid Token Details", 401);
  }

  const validUser = await User.findById(loginUserDetails._id);

  if (!validUser) {
    await fs.promises.unlink(FilePath.path);
    throw new CustomError("", "Invalid User", 401);
  }
  removeProfileImage(validUser.profilePicture);
  const result = await uplodeCloudanry(FilePath.path);
  if (!result) {
    throw new CustomError("", "Fail to uplode Image to Cloud", 401);
  }

  try {
    validUser.username = username;
    validUser.profilePicture = result.secure_url;
    await validUser.save({ validateBeforeSave: false });
  } catch (e) {
    removeProfileImage(file.path);
    throw new CustomError(
      e?.message ?? "Server Error",
      "Fail to Update Details",
      401
    );
  }

  return res.status(201).json({
    message: "Details Update Successfully",
    statusCode: 201,
  });
});

// // MARK: To be Done later
// const loguotUser = asyncHandler(async (req, res) => {
//   const user = req.user;
//   if (!user) {
//     throw new CustomError("", "Invalid User", 401);
//   }

// });

export { RegisterUser, LoginUser, UplodeOrChangeUsername };
