// server/src/domains/catalog/controllers/products.controller.js
import { getProductsList, getCategoriesList, getProductDetail } from "../services/products.service.js";

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

export async function showProduct(req, res, next) {
  try {
    const { slug } = req.params;
    const data = await getProductDetail(slug);

    if (!data) {
      return res.status(404).json({ success: false, data: null, error: { message: "Product not found" } });
    }

    return res.json({ success: true, data, error: null });
  } catch (err) {
    next(err);
  }
}
