import { Router } from "express"
import { createOrder, getUserOrdersOverview, cancelOrder, getOrderById} from "../controllers/order.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/c/:cartid/a/:addressid").post(createOrder);
router.route("/user").get(getUserOrdersOverview);
router.route("/:orderid").delete(cancelOrder);
router.route("/:orderid").get(getOrderById);

export default router;