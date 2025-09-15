// server/src/domains/catalog/services/home.service.js

// TẠM THỜI comment DB repo vì chưa có dữ liệu
// import { findFeaturedProducts } from '../repositories/home.repo.js';

// Mock data: giữ đúng shape FE đang dùng: { id, name, price, image }
const MOCK_FEATURED = [
  { id: 1, name: 'Laptop X Pro',     price: 25990000, image: '/vite.svg' },
  { id: 2, name: 'Phone Y Max',      price: 18990000, image: '/vite.svg' },
  { id: 3, name: 'Headphone Z',      price:  2990000, image: '/vite.svg' },
  { id: 4, name: 'Keyboard TKL',     price:  990000,  image: '/vite.svg' },
  { id: 5, name: 'Monitor 27" IPS',  price:  5590000, image: '/vite.svg' },
  { id: 6, name: 'Mouse Wireless',   price:  490000,  image: '/vite.svg' },
  { id: 7, name: 'USB-C Hub 7in1',   price:  790000,  image: '/vite.svg' },
  { id: 8, name: 'SSD NVMe 1TB',     price:  2290000, image: '/vite.svg' },
];

// Nếu sau này muốn auto chuyển sang DB khi có dữ liệu,
// bạn có thể dùng env: USE_HOME_DB=true
const USE_HOME_DB = process.env.USE_HOME_DB === 'true';

export async function getHomeData() {
  // CÁCH 1 (đơn giản): luôn trả mock, bỏ qua DB cho tới khi bạn bật lại
  if (!USE_HOME_DB) {
    return {
      message: 'Welcome to Home',
      featured: MOCK_FEATURED,
    };
  }

  return {
    message: 'Welcome to Home',
    featured: MOCK_FEATURED,
  };
}
