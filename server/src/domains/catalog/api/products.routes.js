// server/src/domains/catalog/api/products.routes.js
import { Router } from "express";
import { listProducts, listCategories, showProduct } from "../controllers/products.controller.js";
// (optional) import { validateQuery } from "../validators/products.schema.js";

const router = Router();
const catalogRouter = Router();

// GET /api/products?search=&category=&page=1&limit=12&sort=newest
router.get("/", /* validateQuery, */ listProducts);
router.get("/:slug", showProduct);

// GET /api/catalog/categories
catalogRouter.get("/categories", listCategories);

export { catalogRouter };
export default router;
