// product.routes.js
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

// ========================================
// ⚠️ ORDEN CRÍTICO: Rutas específicas primero
// ========================================

// 1️⃣ RUTAS DE BÚSQUEDA Y FILTROS (antes de /:id)
router.get("/products/search", getProductsWithFilters);
router.get("/products/search-features", searchByFeatures);
router.get("/products/ending-soon", getEndingSoon);
router.get("/products/bargains", getBargains);

// 2️⃣ RUTAS CON PARÁMETROS DINÁMICOS
router.get("/products/:id/similar", getSimilarProducts);

// 3️⃣ RUTAS AUTENTICADAS ESPECÍFICAS
router.get("/products/my-products", authRequired, getMyProducts);

// 4️⃣ RUTAS GENERALES
router.get("/products", getProducts);
router.get("/products/:id", getProduct);

// 5️⃣ RUTAS DE MODIFICACIÓN (requieren autenticación)
router.post("/products", authRequired, createProduct);
router.delete("/products/:id", authRequired, deleteProduct);
router.put("/products/:id", authRequired, updateProduct);

// 6️⃣ RUTAS DE SUBASTA
router.post("/products/:productId/accept-bid", authRequired, acceptBid);
router.post("/products/:productId/cancel", authRequired, cancelAuction);

export default router;