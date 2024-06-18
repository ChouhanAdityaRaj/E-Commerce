import { Router } from "express";
import { signup, login, logout, refreshAccessToken } from "../controllers/user.controller.js";
import {validate} from "../middlewares/validate.middleware.js";
import {signupSchema, loginSchema} from "../validations/user.schema.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(validate(signupSchema), signup);
router.route("/login").post(validate(loginSchema), login);
router.route("/refresh-token").post(refreshAccessToken);

// Secure Routes
router.route("/logout").post(verifyJWT, logout);

export default router;