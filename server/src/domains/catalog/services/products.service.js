// server/src/domains/catalog/services/products.service.js
import { findProducts } from '../repositories/products.repo.js';

/**
 * getProductsList: gom data trả cho controller
 * @param {Object} query - lấy từ req.query sau này
 */
export async function getProductsList(query = {}) {
  const page = Number(query.page || 1);
  const limit = Math.min(50, Number(query.limit || 12)); // chặn limit quá lớn
  const search = (query.search || '').trim();
  const categorySlug = (query.category || '').trim();
  const sort = (query.sort || 'newest').trim(); // 'newest' | 'price_asc' | 'price_desc'

  const result = await findProducts({ page, limit, search, categorySlug, sort });

  // Map về shape FE (name = title, image = imageUrl)
  const items = result.items.map(p => ({
    id: p.id,
    name: p.title,
    price: Number(p.price),
    currency: p.currency,
    image: p.imageUrl || '/vite.svg'
  }));

  return {
    items,
    total: result.total,
    page: result.page,
    limit: result.limit
  };
}
