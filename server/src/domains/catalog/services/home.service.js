// server/src/domains/catalog/services/home.service.js
import { prisma } from '../../../infrastructure/db/prisma.js';

// Giữ mock để fallback nếu DB rỗng
const MOCK_FEATURED = [
  { id: 1, name: 'Laptop X Pro',     price: 25990000, image: '/vite.svg' },
  { id: 2, name: 'Phone Y Max',      price: 18990000, image: '/vite.svg' },
  { id: 3, name: 'Headphone Z',      price:  2990000, image: '/vite.svg' },
  { id: 4, name: 'Keyboard TKL',     price:   990000, image: '/vite.svg' },
  { id: 5, name: 'Monitor 27\" IPS', price:  5590000, image: '/vite.svg' },
  { id: 6, name: 'Mouse Wireless',   price:   490000, image: '/vite.svg' },
  { id: 7, name: 'USB-C Hub 7in1',   price:   790000, image: '/vite.svg' },
  { id: 8, name: 'SSD NVMe 1TB',     price:  2290000, image: '/vite.svg' },
];

export async function getHomeData() {
  // Lấy 8 sản phẩm active mới nhất + ảnh đầu tiên
  // Bảng & cột theo DB.sql: products, product_images(url), created_at, active, price, currency. 
  // (name FE = title DB)
  const rows = await prisma.$queryRaw`
    SELECT 
      p.id,
      p.title,
      p.price,
      p.currency,
      (
        SELECT i.url 
        FROM product_images i 
        WHERE i.product_id = p.id 
        ORDER BY i.id ASC 
        LIMIT 1
      ) AS imageUrl
    FROM products p
    WHERE p.active = 1
    ORDER BY p.created_at DESC
    LIMIT 8;
  `;

  const featured = Array.isArray(rows) ? rows.map(r => ({
    id: r.id,
    name: r.title,                          // map title -> name cho FE
    price: Number(r.price),                 // DECIMAL -> number
    image: r.imageUrl || '/vite.svg',       // fallback nếu chưa có ảnh
  })) : [];

  return {
    message: 'Welcome to Home',
    featured: featured.length > 0 ? featured : MOCK_FEATURED,
  };
}
