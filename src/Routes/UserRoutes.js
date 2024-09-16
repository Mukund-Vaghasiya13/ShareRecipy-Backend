import { Router } from "express";
import {
  RegisterUser,
  LoginUser,
} from "../Controllers/UserRegisterAndAuthentication.js";

const router = Router();

router.route("/register").post(RegisterUser);
router.route("/login").post(LoginUser);

export const UserRoute = router;