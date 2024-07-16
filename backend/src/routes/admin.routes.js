import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllUser, addNewProduct, updateProductDetails, updateProductImage, addOtherProductImages, deleteOtherProductImage, updateStock, updateProductCategory, deleteProduct, createCategory, updateCategor, deleteCategory } from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import { addNewProductSchema, updateProductDetailsSchema, updateStockSchema, createCategorySchema, updateCategorySchema} from "../validations/admin.schema.js";
import { validate } from "../middlewares/validate.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(verifyAdmin);


// Admin User Routes
router.route("/user").get(getAllUser);


// Admin Product Routes
router.route("/product").post(
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
router.route("/product/:productid/details").patch(validate(updateProductDetailsSchema), updateProductDetails);
router.route("/product/:productid/image").patch(upload.single("productImage"), updateProductImage);
router.route("/product/:productid/other-image").patch(upload.fields([{name: "productOtherImages", maxCount: 5}]), addOtherProductImages);
router.route("/product/:productid/other-image").delete(deleteOtherProductImage);
router.route("/product/:productid/stock").patch(validate(updateStockSchema), updateStock);
router.route("/product/:productid").delete(deleteProduct);
router.route("/product/:productid/category/:categoryid").patch(updateProductCategory);


// Admin Category Routes
router.route("/category").post(validate(createCategorySchema), createCategory);
router.route("/category/:categoryid").patch(validate(updateCategorySchema), updateCategor);
router.route("/category/:categoryid/:newCategoryid?").delete(deleteCategory);

export default router;
