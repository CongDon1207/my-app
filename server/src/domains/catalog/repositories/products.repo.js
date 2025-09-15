// server/src/domains/catalog/repositories/products.repo.js
import { prisma } from '../../../infrastructure/db/prisma.js';

// sort: 'newest' | 'price_asc' | 'price_desc'
function buildOrderBy(sort) {
  switch (sort) {
    case 'price_asc':  return 'p.price ASC, p.created_at DESC';
    case 'price_desc': return 'p.price DESC, p.created_at DESC';
    default:           return 'p.created_at DESC'; // newest
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
  const offset = Math.max(0, (Number(page) - 1) * Number(limit));
  const orderBy = buildOrderBy(sort);

  // WHERE điều kiện
  // - active = 1
  // - search theo title/description nếu có
  // - filter theo category nếu có
  const whereClauses = ['p.active = 1'];
  const params = [];

  if (search) {
    whereClauses.push('(p.title LIKE CONCAT("%", ?, "%") OR p.description LIKE CONCAT("%", ?, "%"))');
    params.push(search, search);
  }
  if (categorySlug) {
    whereClauses.push('c.slug = ?');
    params.push(categorySlug);
  }
  const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Main query: items
  const items = await prisma.$queryRawUnsafe(
    `
    SELECT 
      p.id,
      p.title,
      p.price,
      p.currency,
      (
        SELECT i.url 
        FROM product_images i 
        WHERE i.product_id = p.id 
        ORDER BY i.id ASC LIMIT 1
      ) AS imageUrl
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    ${whereSQL}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?;
    `,
    ...params, Number(limit), offset
  );

  // Count query: total
  const totalRows = await prisma.$queryRawUnsafe(
    `
    SELECT COUNT(*) as total
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    ${whereSQL};
    `,
    ...params
  );
  const total = Array.isArray(totalRows) && totalRows[0]?.total ? Number(totalRows[0].total) : 0;

  return {
    items: Array.isArray(items) ? items : [],
    total,
    page: Number(page),
    limit: Number(limit)
  };
}
