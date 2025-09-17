// server/src/domains/catalog/api/products.routes.js
import { Router } from 'express';
import { listProducts, listCategories } from '../controllers/products.controller.js';
// (Tuỳ chọn) import { validateQuery } from '../validators/products.schema.js';

const router = Router();

// GET /api/products?search=&category=&page=1&limit=12&sort=newest
router.get('/', /* validateQuery, */ listProducts);
// GET /api/products/categories
router.get('/categories', listCategories);

export default router;
