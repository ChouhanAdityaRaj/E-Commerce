import { Router } from "express";
import { addToCart, updateCartItem, removeCartItem, getCartInfo } from "../controllers/cart.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addToCartSchema, updatecartItemSchematSchema } from "../validations/cart.schema.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/p/:productid").post(validate(addToCartSchema), addToCart);
router.route("/:cartid/i/:itemid").patch(validate(updatecartItemSchematSchema), updateCartItem);
router.route("/:cartid/i/:itemid").delete(removeCartItem);
router.route("/:cartid").get(getCartInfo)

export default router;