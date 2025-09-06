// server/src/domains/catalog/repositories/home.repo.js

// [Suy luận] Tạm thời mock dữ liệu; sẽ thay bằng Prisma sau.
export async function fetchHomeData() {
  return {
    message: "Welcome to Home Page",
    featuredProducts: [
      { id: 1, name: "Sample Product A", price: 100 },
      { id: 2, name: "Sample Product B", price: 200 },
    ],
    categories: [
      { id: "c1", name: "Category 1" },
      { id: "c2", name: "Category 2" },
    ],
  };
}
