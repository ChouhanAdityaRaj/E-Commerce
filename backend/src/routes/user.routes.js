import { Router } from "express";
import { signup } from "../controllers/user.controller.js";
import {validate} from "../middlewares/validate.middleware.js";
import {signupSchema} from "../validations/signup.schema.js";

const router = Router();

router.route("/signup").post(validate(signupSchema),signup);

export default router;