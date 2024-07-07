import { Router } from "express";
import { createReview, updateReview, deleteReview, getReviewById, getProductReviews } from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createReviewSchema, updateReviewSchema } from "../validations/review.schema.js";

const router = Router();

router.use(verifyJWT);

router.route("/p/:productid").post(validate(createReviewSchema), createReview);
router.route("/:reviewid").patch(validate(updateReviewSchema), updateReview);
router.route("/:reviewid").delete(deleteReview)
router.route("/:reviewid").get(getReviewById)
router.route("/p/:productid").get(getProductReviews);

export default router;