import { Router } from "express";
import { signup, login } from "../controllers/user.controller.js";
import {validate} from "../middlewares/validate.middleware.js";
import {signupSchema, loginSchema} from "../validations/user.schema.js";

const router = Router();

router.route("/signup").post(validate(signupSchema), signup);
router.route("/login").post(validate(loginSchema), login);

export default router;