// client/src/pages/ProductDetail.jsx
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductDetailApi } from "../api/products";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductDetailApi(slug),
    enabled: Boolean(slug),
  });

  const onBack = () => {
    navigate(-1);
  };

  if (!slug) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-red-600">Tham so san pham khong hop le.</p>
        <Link to="/products" className="text-blue-600 hover:underline">
          Quay lai danh sach
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Dang tai san pham...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-red-600">Khong tai duoc san pham: {error?.message || "Loi khong xac dinh"}</p>
        <Link to="/products" className="text-blue-600 hover:underline">
          Quay lai danh sach
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-red-600">San pham khong ton tai.</p>
        <Link to="/products" className="text-blue-600 hover:underline">
          Quay lai danh sach
        </Link>
      </div>
    );
  }

  const images = Array.isArray(data.images) && data.images.length > 0 ? data.images : ["/vite.svg"];

  return (
    <div className="p-6 space-y-6">
      <button onClick={onBack} className="text-blue-600 hover:underline">
        Quay lai
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="aspect-video bg-gray-50 flex items-center justify-center overflow-hidden rounded-lg">
            <img src={images[0]} alt={data.name} className="max-h-96 object-contain" />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1).map((url, index) => (
                <img key={url || index} src={url} alt={`${data.name} ${index + 2}`} className="h-20 object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">{data.name}</h1>
            {data.category && (
              <p className="text-sm text-gray-500 mt-1">
                Thuoc danh muc:
                {' '}
                <Link to={`/products?category=${data.category.slug}`} className="text-blue-600 hover:underline">
                  {data.category.name}
                </Link>
              </p>
            )}
          </div>

          <div className="text-2xl font-semibold text-gray-900">
            {Number(data.price).toLocaleString("vi-VN")} {data.currency || 'VND'}
          </div>

          <p className="text-gray-700 whitespace-pre-line">
            {data.description || 'Mo ta dang duoc cap nhat.'}
          </p>

          <div className="text-sm text-gray-600">
            So luong ton: <span className="font-medium text-gray-800">{data.stock}</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded bg-black text-white" type="button">
              Them vao gio hang
            </button>
            <Link to="/products" className="text-blue-600 hover:underline">
              Xem cac san pham khac
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
