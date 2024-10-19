import { Router } from "express"
import { createOrder } from "../controllers/order.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/c/:cartid/a/:addressid").post(createOrder);

export default router;