import { Router } from "express";
import { searchProducts, getProductById, getAllProducts } from "../controllers/product.controller.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

router.route("/").get(searchProducts);
router.route("/all-products").get(getAllProducts);
router.route("/:productid").get(getProductById);

export default router;