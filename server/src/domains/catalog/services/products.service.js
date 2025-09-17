// server/src/domains/catalog/services/products.service.js
import { findProducts, findCategories, findProductBySlug } from '../repositories/products.repo.js';

/**
 * getProductsList: return data for the controller layer
 * @param {Object} query - normalized from req.query
 */
export async function getProductsList(query = {}) {
  const page = Number(query.page || 1);
  const limit = Math.min(50, Number(query.limit || 12));
  const search = (query.search || '').trim();
  const categorySlug = (query.category || '').trim();
  const sort = (query.sort || 'newest').trim();

  const result = await findProducts({ page, limit, search, categorySlug, sort });

  const items = result.items.map((p) => ({
    id: p.id,
    slug: p.slug,
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

export async function getProductDetail(slug) {
  if (!slug) {
    return null;
  }

  const product = await findProductBySlug(slug);
  if (!product) {
    return null;
  }

  return {
    id: product.id,
    slug: product.slug,
    name: product.title,
    description: product.description || '',
    price: Number(product.price),
    currency: product.currency,
    stock: Number(product.stock ?? 0),
    createdAt: product.createdAt,
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        }
      : null,
    images: Array.isArray(product.images) ? product.images.map((img) => img.url) : [],
  };
}

export async function getCategoriesList() {
  // Lấy danh sách categories từ DB
  // Bảng & cột theo DB.sql: categories(id, name, slug)
  const rows = await findCategories({ onlyWithProducts: true });

  // Map về shape cho FE (giữ các trường cần thiết)
  return rows.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    parentId: c.parentId ?? null,
    productCount: Number(c.productCount || 0)
  }));
}

