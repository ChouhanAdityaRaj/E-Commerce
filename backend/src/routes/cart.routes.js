import { Router } from "express";
import { addToCart } from "../controllers/cart.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addToCartSchema } from "../validations/cart.schema.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/p/:productid").post(validate(addToCartSchema), addToCart);

export default router;