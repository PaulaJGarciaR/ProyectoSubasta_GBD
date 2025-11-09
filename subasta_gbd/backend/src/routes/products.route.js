import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getProducts,
  getMyProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  acceptBid,
  cancelAuction,
  getProductsWithFilters,
  searchByFeatures,
  getEndingSoon,
  getBargains,
  getSimilarProducts
} from "../controllers/products.controller.js";

const router = Router();

router.get("/products/search", getProductsWithFilters);
router.get("/products/search-features", searchByFeatures);
router.get("/products/ending-soon", getEndingSoon);
router.get("/products/bargains", getBargains);

router.get("/products/:id/similar", getSimilarProducts);

router.get("/products/my-products", authRequired, getMyProducts);

router.get("/products", getProducts);
router.get("/products/:id", getProduct);

router.post("/products", authRequired, createProduct);
router.delete("/products/:id", authRequired, deleteProduct);
router.put("/products/:id", authRequired, updateProduct);


router.post("/products/:productId/accept-bid", authRequired, acceptBid);
router.post("/products/:productId/cancel", authRequired, cancelAuction);

export default router;