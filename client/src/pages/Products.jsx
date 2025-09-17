// client/src/pages/Products.jsx
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { getProductsApi, getCategoriesApi } from "../api/products";

const SORT_OPTIONS = [
  { value: "newest", label: "Moi nhat" },
  { value: "price_asc", label: "Gia tang dan" },
  { value: "price_desc", label: "Gia giam dan" },
];

const DEFAULT_CATEGORY_OPTION = { value: "", label: "Tat ca" };

function normalizeSort(value) {
  return SORT_OPTIONS.some((option) => option.value === value) ? value : "newest";
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = (searchParams.get("search") ?? "").trim();
  const initialCategory = searchParams.get("category") ?? "";
  const initialSort = normalizeSort(searchParams.get("sort") ?? "newest");
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
    if (nextSearch !== search) {
      setSearch(nextSearch);
      setKeyword(nextSearch);
    }

    const nextCategory = searchParams.get("category") ?? "";
    if (nextCategory !== category) {
      setCategory(nextCategory);
    }

    const nextSort = normalizeSort(searchParams.get("sort") ?? "newest");
    if (nextSort !== sort) {
      setSort(nextSort);
    }

    const nextPageParsed = parseInt(searchParams.get("page") ?? "1", 10);
    const nextPage = Number.isFinite(nextPageParsed) && nextPageParsed > 0 ? nextPageParsed : 1;
    if (nextPage !== page) {
      setPage(nextPage);
    }
  }, [paramsSnapshot]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sort !== "newest") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));

    const desired = params.toString();
    if (desired !== paramsSnapshot) {
      setSearchParams(params, { replace: true });
    }
  }, [page, search, category, sort, paramsSnapshot, setSearchParams]);

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

  const onSubmitSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(keyword.trim());
  };

  const onChangeCategory = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const onChangeSort = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  return (
    <div className="p-4 space-y-4">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-semibold">Products</h1>

        <div className="flex flex-wrap gap-2">
          <form onSubmit={onSubmitSearch} className="flex gap-2">
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tim kiem san pham..."
              className="border rounded-lg px-3 py-2"
            />
            <button type="submit" className="px-4 py-2 rounded-lg bg-black text-white">
              Tim
            </button>
          </form>

          <select
            value={category}
            onChange={onChangeCategory}
            className="border rounded-lg px-3 py-2"
            aria-label="Category"
            disabled={isLoadingCategories}
          >
            {isLoadingCategories ? (
              <option>Dang tai...</option>
            ) : (
              categoryOptions.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))
            )}
          </select>

          <select
            value={sort}
            onChange={onChangeSort}
            className="border rounded-lg px-3 py-2"
            aria-label="Sort"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {categoriesError && (
        <p className="text-sm text-red-600" role="alert">
          Khong tai duoc danh muc: {categoriesError.message || "Loi khong xac dinh"}
        </p>
      )}

      {(isLoading || isFetching) && <div className="text-gray-600">Dang tai...</div>}
      {isError && <div className="text-red-600">Loi: {error.message}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/products/${item.slug}`}
            className="border rounded-xl p-3 hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <div className="aspect-video bg-gray-50 flex items-center justify-center overflow-hidden rounded-lg">
              <img src={item.image} alt={item.name} className="max-h-24" />
            </div>
            <div className="mt-2 space-y-1">
              <div className="font-medium line-clamp-2 text-gray-900">{item.name}</div>
              <div className="text-gray-700">
                {Number(item.price).toLocaleString("vi-VN")}
                <span className="ml-1 uppercase">{item.currency || "vnd"}</span>
              </div>
            </div>
          </Link>
        ))}
        {items.length === 0 && !isLoading && !isFetching && (
          <div className="col-span-full text-gray-500">Khong co san pham.</div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          className="px-3 py-1 border rounded-lg disabled:opacity-50"
        >
          Truoc
        </button>
        <span>
          Trang {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          className="px-3 py-1 border rounded-lg disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
}
