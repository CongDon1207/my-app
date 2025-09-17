// server/src/domains/catalog/repositories/products.repo.js
import { prisma } from '../../../infrastructure/db/prisma.js';

// sort: 'newest' | 'price_asc' | 'price_desc'
function buildOrderBy(sort) {
  // Return an array suitable for Prisma's orderBy
  switch (sort) {
    case 'price_asc':
      return [{ price: 'asc' }, { created_at: 'desc' }];
    case 'price_desc':
      return [{ price: 'desc' }, { created_at: 'desc' }];
    default:
      return [{ created_at: 'desc' }]; // newest
  }
}

/**
 * findProducts: đọc từ DB theo bộ lọc/phân trang.
 * @param {Object} opts
 * @param {number} opts.page
 * @param {number} opts.limit
 * @param {string} [opts.search]
 * @param {string} [opts.categorySlug]
 * @param {string} [opts.sort] - 'newest' | 'price_asc' | 'price_desc'
 */
export async function findProducts({ page = 1, limit = 12, search = '', categorySlug = '', sort = 'newest' } = {}) {
  const skip = Math.max(0, (Number(page) - 1) * Number(limit));
  const take = Number(limit);
  const orderBy = buildOrderBy(sort);

  const where = { active: true };

  if (search) {
    where.OR = [
      { title: { contains: String(search), mode: 'insensitive' } },
      { description: { contains: String(search), mode: 'insensitive' } }
    ];
  }

  if (categorySlug) {
    where.categories = { slug: String(categorySlug) };
  }

  const items = await prisma.products.findMany({
    where,
    select: {
      id: true,
      slug: true,
      title: true,
      price: true,
      currency: true,
      product_images: {
        select: { url: true },
        orderBy: { id: 'asc' },
        take: 1
      }
    },
    orderBy,
    skip,
    take
  });

  const total = await prisma.products.count({ where });

  const mapped = items.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    price: p.price,
    currency: p.currency,
    imageUrl: Array.isArray(p.product_images) && p.product_images[0] ? p.product_images[0].url : null
  }));

  return {
    items: mapped,
    total: Number(total),
    page: Number(page),
    limit: Number(limit)
  };
}

export async function findProductBySlug(slug) {
  if (!slug) return null;

  const product = await prisma.products.findUnique({
    where: { slug: String(slug) },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      price: true,
      currency: true,
      stock: true,
      created_at: true,
      categories: {
        select: { id: true, name: true, slug: true }
      },
      product_images: {
        select: { id: true, url: true },
        orderBy: { id: 'asc' }
      }
    }
  });

  if (!product) return null;

  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    description: product.description,
    price: product.price,
    currency: product.currency,
    stock: product.stock,
    createdAt: product.created_at,
    category: product.categories
      ? { id: product.categories.id, name: product.categories.name, slug: product.categories.slug }
      : null,
    images: Array.isArray(product.product_images)
      ? product.product_images.map((img) => ({ id: img.id, url: img.url }))
      : []
  };
}

/**
 * findCategories: lấy danh sách categories.
 * - Mặc định chỉ trả về những danh mục có ít nhất 1 product active (active = true).
 * @param {Object} opts
 * @param {boolean} [opts.onlyWithProducts=true] - nếu false sẽ trả về tất cả category
 */
export async function findCategories({ onlyWithProducts = true } = {}) {
  const where = onlyWithProducts ? { products: { some: { active: true } } } : {};

  const rows = await prisma.categories.findMany({
    where,
    select: {
      id: true,
      name: true,
      slug: true,
      parent_id: true,
      _count: {
        select: { products: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  return Array.isArray(rows)
    ? rows.map(r => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        parentId: r.parent_id,
        productCount: r._count?.products ?? 0
      }))
    : [];
}


