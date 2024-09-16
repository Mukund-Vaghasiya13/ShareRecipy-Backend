import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../Modles/UserModle.js";
import { CustomError } from "../utils/CustomErrorClass.js";

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

  return res.status(201).json({
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

  if (!user) {
    throw new CustomError("", "User is not Registerd", 500);
  }

  if (!user.isPasswordCorrect(password)) {
    throw new CustomError("", "Fail To Authenticate", 500);
  }

  const token = user.generateResponseToken();
  if (!token) {
    throw new CustomError("", "Fail to Genrate Token", 500);
  }

  return res.status(201).json({
    Logintoken: token,
    message: "Login Successfull",
    statusCode: 201,
  });
});

export { RegisterUser, LoginUser };
