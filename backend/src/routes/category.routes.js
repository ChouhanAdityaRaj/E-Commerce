import { Router } from "express";
import { getAllCategories, getCategoryById } from "../controllers/category.controller.js";

const router = Router()

router.route("/").get(getAllCategories);
router.route("/:categoryid").get(getCategoryById);

export default router;