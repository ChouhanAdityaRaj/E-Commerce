import { Router } from "express";
import { createReview, updateReview, deleteReview, getReviewById, getProductReviews, deleteReviewImage, addReviewImages} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createReviewSchema, updateReviewSchema } from "../validations/review.schema.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/p/:productid").post(upload.fields([{name: "reviewImages", maxCount: 3}]),validate(createReviewSchema), createReview);
router.route("/:reviewid").patch(validate(updateReviewSchema), updateReview);
router.route("/:reviewid/images").delete(deleteReviewImage);
router.route("/:reviewid/images").patch(upload.fields([{name: "reviewImages", maxCount: 3}]), addReviewImages);
router.route("/:reviewid").delete(deleteReview)
router.route("/:reviewid").get(getReviewById)
router.route("/p/:productid").get(getProductReviews);

export default router;