import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addAddress, updateAddress } from "../controllers/address.controller.js";
import { addAddressSchema, updateAddressSchema } from "../validations/address.schema.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(validate(addAddressSchema), addAddress)
router.route("/:addressid").patch(validate(updateAddressSchema), updateAddress)

export default router;