import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllUser, addNewProduct, updateProductDetails, updateProductImage, updateAddOtherProductImages } from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import { addNewProductSchema, updateProductDetailsSchema } from "../validations/admin.schema.js";
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

router.route("/product/:productid/details").patch(validate(updateProductDetailsSchema), updateProductDetails)
router.route("/product/:productid/image").patch(upload.single("productImage"), updateProductImage);
router.route("/product/:productid/other-image").patch(upload.fields([{name: "productOtherImages", maxCount: 5}]), updateAddOtherProductImages);

export default router;
