import { Router } from "express";
import { searchProducts } from "../controllers/product.controller.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

router.route("/").get(searchProducts);

export default router;