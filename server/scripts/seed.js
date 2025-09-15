// server/scripts/seed.js
// Chạy: node scripts/seed.js
import { prisma } from '../src/infrastructure/db/prisma.js';

// DỮ LIỆU MẪU
const CATEGORIES = [
  { name: 'Electronics', slug: 'electronics', parent_id: null },
  { name: 'Accessories', slug: 'accessories', parent_id: null },
];

const PRODUCTS = [
  {
    title: 'Laptop X Pro 14',
    slug: 'laptop-x-pro-14',
    description: 'Ultrabook 14", i7, 16GB RAM, 512GB SSD',
    price: '25990000', // DECIMAL → truyền string
    currency: 'VND',
    stock: 10,
    category_slug: 'electronics',
    images: ['https://bizweb.dktcdn.net/thumb/1024x1024/100/259/059/products/img-20211001-111546.jpg?v=1634130605773'],
  },
  {
    title: 'Phone Y Max',
    slug: 'phone-y-max',
    description: '6.7" AMOLED, 8GB RAM, 256GB',
    price: '18990000',
    currency: 'VND',
    stock: 12,
    category_slug: 'electronics',
    images: ['https://cdn.tgdd.vn/Products/Images/42/190321/iphone-xs-max-gold-600x600.jpg'],
  },
  {
    title: 'Headphone Z ANC',
    slug: 'headphone-z-anc',
    description: 'Bluetooth, chống ồn chủ động',
    price: '2990000',
    currency: 'VND',
    stock: 30,
    category_slug: 'accessories',
    images: ['https://shop.zebronics.com/cdn/shop/files/Zeb-Dukeplus-Blue-pic1_2cbbfbae-98b4-48ac-bf1e-cb77c2442833.jpg?v=1751115351&width=2000'],
  },
  {
    title: 'Keyboard TKL',
    slug: 'keyboard-tkl',
    description: 'Bàn phím cơ TKL, switch brown',
    price: '990000',
    currency: 'VND',
    stock: 25,
    category_slug: 'accessories',
    images: ['https://m.media-amazon.com/images/I/71W9Ran3z7L.jpg'],
  },
  {
    title: 'USB-C Hub 7in1',
    slug: 'usb-c-hub-7in1',
    description: 'HDMI, USB 3.0 x3, SD, microSD, PD',
    price: '790000',
    currency: 'VND',
    stock: 50,
    category_slug: 'accessories',
    images: ['https://ugreenhanoi.vn/img/i/60515-hub-usb-c-7-in-1-usb-type-c-ra-hdmi-4k@60hz-usb-lan-gigabit-pd100w-sd-tf-ugreen-cao-cap-1496.jpg'],
  },
  {
    title: 'SSD NVMe 1TB',
    slug: 'ssd-nvme-1tb',
    description: 'PCIe Gen3 x4, tốc độ đọc 3200MB/s',
    price: '2290000',
    currency: 'VND',
    stock: 40,
    category_slug: 'electronics',
    images: ['https://images.samsung.com/is/image/samsung/p6pim/sg/mz-v8v1t0bw/gallery/sg-980-nvme-m2-ssd-mz-v8v1t0bw-401525667?$684_547_PNG$'],
  },
];

async function main() {
  console.log('🌱 Seeding categories...');
  // Upsert categories
  for (const c of CATEGORIES) {
    await prisma.categories.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        name: c.name,
        slug: c.slug,
        parent_id: c.parent_id,
      },
    });
  }

  console.log('🌱 Seeding products + images...');
  for (const p of PRODUCTS) {
    // Lấy category_id từ slug
    const category = await prisma.categories.findUnique({
      where: { slug: p.category_slug },
      select: { id: true },
    });
    if (!category) {
      console.warn(`⚠️ Category not found for product ${p.slug}`);
      continue;
    }

    // Upsert product
    const product = await prisma.products.upsert({
      where: { slug: p.slug },
      update: {}, // tránh ghi đè khi chạy lại
        create: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        price: p.price,       // DECIMAL(12,2)
        currency: p.currency, // VARCHAR(8)
        stock: p.stock,
        active: true,
        category_id: category.id,
      },
      select: { id: true },
    });

    // Ảnh: xóa & tạo lại để đảm bảo nhất quán sau nhiều lần seed
    await prisma.product_images.deleteMany({ where: { product_id: product.id } });
    for (const url of p.images) {
      await prisma.product_images.create({
        data: { product_id: product.id, url },
      });
    }
  }

  console.log('✅ Seed done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
