// client/src/pages/Home.jsx
import { useQuery } from "@tanstack/react-query";
import { getHome } from "../api/home";

export default function Home() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["home"],
    queryFn: getHome,
  });

  if (isLoading) return <div className="p-4">Đang tải trang chủ...</div>;
  if (isError) return <div className="p-4 text-red-600">Lỗi: {error?.message}</div>;

  const { message, featuredProducts = [], categories = [] } = data || {};

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Home</h1>
      <p className="text-gray-700">{message}</p>

      <section>
        <h2 className="text-xl font-semibold mb-2">Danh mục</h2>
        <div className="flex flex-wrap gap-2">
          {categories.length === 0 && <span className="text-gray-500">Chưa có danh mục</span>}
          {categories.map((c) => (
            <span key={c.id} className="border rounded-xl px-3 py-1">
              {c.name}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Sản phẩm nổi bật</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {featuredProducts.length === 0 && (
            <div className="text-gray-500">Chưa có sản phẩm</div>
          )}
          {featuredProducts.map((p) => (
            <div key={p.id} className="border rounded-2xl p-3 shadow-sm">
              <div className="font-medium">{p.name}</div>
              {"price" in p && <div className="text-sm text-gray-600">Giá: {p.price}</div>}
              <button className="mt-2 border rounded-xl px-3 py-1">Xem chi tiết</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
