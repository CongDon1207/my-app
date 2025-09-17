// client/src/api/products.js
import http from "../shared/api/http";

export async function getProductsApi(params = {}) {
  const { page = 1, limit = 12, search = "", category = "", sort = "newest" } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
    category,
    sort
  }).toString();

  const res = await http.get(`/products?${query}`);
  // BE trả { success, data, error }
  if (!res?.data?.success) {
    const msg = res?.data?.error?.message || res?.data?.error || "Failed to fetch products";
    throw new Error(msg);
  }
  // Trả phần payload data: { items, total, page, limit }
  return res.data.data;
}

export async function getCategoriesApi() {
  const res = await http.get('/products/categories');
  // BE trả { success, data, error }
  if (!res?.data?.success) {
    const msg = res?.data?.error?.message || res?.data?.error || 'Failed to fetch categories';
    throw new Error(msg);
  }

  // Trả mảng categories: [{ id, name, slug, parentId, productCount }, ...]
  return res.data.data;
}
