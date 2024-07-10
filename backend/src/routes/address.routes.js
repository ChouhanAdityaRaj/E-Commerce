import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addAddress } from "../controllers/address.controller.js";
import { addAddressSchema } from "../validations/address.schema.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(validate(addAddressSchema), addAddress)

export default router;