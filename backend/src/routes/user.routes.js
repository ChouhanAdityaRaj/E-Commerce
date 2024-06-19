import { Router } from "express";
import { signup, login, logout, refreshAccessToken, changeFullName } from "../controllers/user.controller.js";
import {validate} from "../middlewares/validate.middleware.js";
import {signupSchema, loginSchema, changeFullNameSchema } from "../validations/user.schema.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(validate(signupSchema), signup);
router.route("/login").post(validate(loginSchema), login);
router.route("/refresh-token").post(refreshAccessToken);

// Secure Routes
router.route("/logout").post(verifyJWT, logout);
router.route("/change-fullname").patch(verifyJWT, validate(changeFullNameSchema), changeFullName);

export default router;