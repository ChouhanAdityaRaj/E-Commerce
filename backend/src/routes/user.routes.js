import { Router } from "express";
import { signup, login, logout, refreshAccessToken, changeFullName, getCurrentUser, changePassword } from "../controllers/user.controller.js";
import {validate} from "../middlewares/validate.middleware.js";
import {signupSchema, loginSchema, changeFullNameSchema, changePasswordSchema } from "../validations/user.schema.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(validate(signupSchema), signup);
router.route("/login").post(validate(loginSchema), login);
router.route("/refresh-token").post(refreshAccessToken);

// Secure Routes
router.route("/logout").post(verifyJWT, logout);
router.route("/change-fullname").patch(verifyJWT, validate(changeFullNameSchema), changeFullName);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/change-password").patch(verifyJWT, validate(changePasswordSchema), changePassword)

export default router;