import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllUser, addNewProduct } from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import { addNewProductSchema } from "../validations/admin.schema.js";
import { validate } from "../middlewares/validate.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(verifyAdmin);

router.route("/user").get(getAllUser);

router.route("/add-new-product").post(
  upload.fields([
    {
      name: "productImage",
      maxCount: 1,
    },
    {
      name: "productOtherImages",
      maxCount: 5,
    },
  ]),
  validate(addNewProductSchema),
  addNewProduct
);

export default router;
