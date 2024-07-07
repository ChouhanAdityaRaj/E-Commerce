import { Router } from "express";
import { createReview } from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createReviewSchema } from "../validations/review.schema.js";

const router = Router();

router.use(verifyJWT);

router.route("/p/:productid").post(validate(createReviewSchema), createReview);

export default router;