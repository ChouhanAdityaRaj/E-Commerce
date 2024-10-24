import { Router } from "express";
import { getAllBanners, getBannerDetails } from "../controllers/banner.controller.js";
const router = Router();

router.route("/").get(getAllBanners);
router.route("/:bannerid").get(getBannerDetails);

export default router;