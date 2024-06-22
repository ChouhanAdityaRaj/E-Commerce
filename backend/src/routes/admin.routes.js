import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllUser } from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(verifyAdmin);

router.route("/user").get(getAllUser);

export default router;
