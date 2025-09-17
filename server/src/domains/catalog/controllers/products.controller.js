// server/src/domains/catalog/controllers/products.controller.js
import { getProductsList } from '../services/products.service.js';
import { getCategoriesList } from '../services/products.service.js';

export async function listProducts(req, res, next) {
  try {
    const data = await getProductsList(req.query);
    return res.json({ success: true, data, error: null });
  } catch (err) {
    next(err);
  }
}

export async function listCategories(req, res, next) {
  try {
    const data = await getCategoriesList();
    return res.json({ success: true, data, error: null });
  } catch (err) {
    next(err);
  }
}
