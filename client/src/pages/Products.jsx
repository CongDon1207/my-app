// client/src/pages/Products.jsx
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getProductsApi, getCategoriesApi } from "../api/products";

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
];

const DEFAULT_CATEGORY_OPTION = { value: "", label: "Tất cả" };

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = (searchParams.get("search") ?? "").trim();
  const initialCategory = searchParams.get("category") ?? "";
  const initialSortRaw = searchParams.get("sort") ?? "newest";
  const initialSort = SORT_OPTIONS.some((option) => option.value === initialSortRaw)
    ? initialSortRaw
    : "newest";
  const initialPageRaw = parseInt(searchParams.get("page") ?? "1", 10);
  const initialPage = Number.isFinite(initialPageRaw) && initialPageRaw > 0 ? initialPageRaw : 1;

  const [page, setPage] = useState(initialPage);
  const [limit] = useState(12);

  const [keyword, setKeyword] = useState(initialSearch);
  const [search, setSearch] = useState(initialSearch);

  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);

  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCategories() {
      try {
        setIsLoadingCategories(true);
        setCategoriesError(null);
        const data = await getCategoriesApi();
        if (!cancelled) {
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setCategories([]);
          setCategoriesError(err);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingCategories(false);
        }
      }
    }

    fetchCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const paramsSnapshot = searchParams.toString();

  useEffect(() => {
    const nextSearch = (searchParams.get("search") ?? "").trim();
    setSearch(nextSearch);
    setKeyword(nextSearch);

    const nextCategory = searchParams.get("category") ?? "";
    setCategory(nextCategory);

    const nextSortRaw = searchParams.get("sort") ?? "newest";
    const nextSort = SORT_OPTIONS.some((option) => option.value === nextSortRaw)
      ? nextSortRaw
      : "newest";
    setSort(nextSort);

    const nextPageRaw = parseInt(searchParams.get("page") ?? "1", 10);
    const nextPage = Number.isFinite(nextPageRaw) && nextPageRaw > 0 ? nextPageRaw : 1;
    setPage(nextPage);
  }, [paramsSnapshot]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (category) {
      params.set("category", category);
    }

    if (sort !== "newest") {
      params.set("sort", sort);
    }

    if (page > 1) {
      params.set("page", String(page));
    }

    const desired = params.toString();
    if (desired !== paramsSnapshot) {
      setSearchParams(params, { replace: true });
    }
  }, [page, search, category, sort, setSearchParams, paramsSnapshot]);

  const categoryOptions = useMemo(() => {
    if (!Array.isArray(categories) || categories.length === 0) {
      return [DEFAULT_CATEGORY_OPTION];
    }

    return [
      DEFAULT_CATEGORY_OPTION,
      ...categories.map((c) => ({
        value: c.slug ?? "",
        label:
          c.productCount != null
            ? `${c.name} (${c.productCount})`
            : c.name ?? DEFAULT_CATEGORY_OPTION.label,
      })),
    ];
  }, [categories]);

  const queryKey = useMemo(
    () => ["products", { page, limit, search, category, sort }],
    [page, limit, search, category, sort]
  );

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey,
    queryFn: () => getProductsApi({ page, limit, search, category, sort }),
    keepPreviousData: true,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const onSubmitSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(keyword.trim());
  };

  const onChangeCategory = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const onChangeSort = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  return (
    <div className="p-4 space-y-4">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-semibold">Products</h1>

        <div className="flex flex-wrap gap-2">
          {/* Search */}
          <form onSubmit={onSubmitSearch} className="flex gap-2">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="border rounded-lg px-3 py-2"
            />
            <button type="submit" className="px-4 py-2 rounded-lg bg-black text-white">
              Tìm
            </button>
          </form>

          {/* Category */}
          <select
            value={category}
            onChange={onChangeCategory}
            className="border rounded-lg px-3 py-2"
            aria-label="Category"
            disabled={isLoadingCategories}
          >
            {isLoadingCategories ? (
              <option>Đang tải...</option>
            ) : (
              categoryOptions.map((c) => (
                <option key={c.value || "all"} value={c.value}>
                  {c.label}
                </option>
              ))
            )}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={onChangeSort}
            className="border rounded-lg px-3 py-2"
            aria-label="Sort"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {categoriesError && (
        <p className="text-sm text-red-600" role="alert">
          Không tải được danh mục: {categoriesError.message || "Lỗi không xác định"}
        </p>
      )}

      {(isLoading || isFetching) && <div className="text-gray-600">Đang tải...</div>}
      {isError && <div className="text-red-600">Lỗi: {error.message}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p) => (
          <div key={p.id} className="border rounded-xl p-3">
            <div className="aspect-video bg-gray-50 flex items-center justify-center overflow-hidden rounded-lg">
              <img src={p.image} alt={p.name} className="max-h-24" />
            </div>
            <div className="mt-2">
              <div className="font-medium line-clamp-2">{p.name}</div>
              <div className="text-gray-700">{Number(p.price).toLocaleString("vi-VN")}?</div>
            </div>
          </div>
        ))}
        {items.length === 0 && !isLoading && !isFetching && (
          <div className="col-span-full text-gray-500">Không có sản phẩm.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded-lg disabled:opacity-50"
        >
          Trước
        </button>
        <span>
          Trang {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 border rounded-lg disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
}
