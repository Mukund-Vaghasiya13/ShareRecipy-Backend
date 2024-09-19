import { Router } from "express";
import {
  RegisterUser,
  LoginUser,
  UplodeOrChangeUsername,
} from "../Controllers/UserRegisterAndAuthentication.js";
import { verifyUser } from "../Middlewares/CheckUserIsValidOrNot.js";
import { upload } from "../Middlewares/MulterImageUplode.js";

const router = Router();

router.route("/register").post(RegisterUser);
router.route("/login").post(LoginUser);
router
  .route("/update")
  .post(verifyUser, upload.single("RecipyUserProfile"), UplodeOrChangeUsername);

export const UserRoute = router;
