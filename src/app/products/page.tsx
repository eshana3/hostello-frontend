"use client";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { useProducts } from "@/hooks/useProducts";
import type { ProductFilters } from "@/types";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const urlSearch = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const isFirstRender = useRef(true);
  const skipNextUrlSync = useRef(false);

  const filters: ProductFilters = {
    category:  searchParams.get("category")  ?? undefined,
    hostel:    searchParams.get("hostel")    ?? undefined,
    condition: searchParams.get("condition") ?? undefined,
    minPrice:  searchParams.get("minPrice")  ? Number(searchParams.get("minPrice"))  : undefined,
    maxPrice:  searchParams.get("maxPrice")  ? Number(searchParams.get("maxPrice"))  : undefined,
    search:    searchParams.get("search")    ?? undefined,
    page:      Number(searchParams.get("page") ?? 1),
    limit:     12,
  };

  const { data, isLoading, isError } = useProducts(filters);

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set(key, value) : params.delete(key);
    if (key !== "page") params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  // Debounced search — fires the actual filter/API update 400ms after the
  // user stops typing instead of on every keystroke. Skips the very first
  // render so it doesn't immediately re-push the URL it was just seeded from.
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    skipNextUrlSync.current = true;
    updateFilter("search", debouncedSearch.trim() || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Keep the search box in sync when the URL changes some other way (e.g.
  // clearing the "search" filter chip, or browser back/forward) — but not
  // when the change was our own debounce push above, which would otherwise
  // immediately clobber whatever the user is still typing.
  useEffect(() => {
    if (skipNextUrlSync.current) { skipNextUrlSync.current = false; return; }
    setSearchInput(urlSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearch]);

  const activeCount = ["category","hostel","condition","minPrice","maxPrice","search"]
    .filter(k => searchParams.get(k)).length;

  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      {/* Page header */}
      <div className="bg-[#151521] border-b border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="section py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                {filters.category ?? "All Products"}
              </h1>
              {data && (
                <p className="text-xs text-[#9CA3AF] mt-0.5 font-medium">
                  {data.total} listing{data.total !== 1 ? "s" : ""} found
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] w-3.5 h-3.5" />
                <input type="text" placeholder="Search listings…"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => {
                    // Enter applies immediately instead of waiting out the debounce
                    if (e.key === "Enter") updateFilter("search", searchInput.trim() || null);
                  }}
                  aria-label="Search listings"
                  className="pl-9 pr-4 py-2 text-sm border border-white/[0.08] rounded-xl bg-[#1E1E2E] text-[#C9D1D9] placeholder-slate-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00] transition-all shadow-sm w-full sm:w-48"
                />
              </div>

              {/* Mobile filter button */}
              <button onClick={() => setShowFilters(true)}
                className="lg:hidden shrink-0 flex items-center gap-2 border border-white/[0.08] rounded-xl px-3 py-2 text-sm font-medium text-white/60 bg-[#1E1E2E] shadow-sm transition-all">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Filters</span>
                {activeCount > 0 && (
                  <span className="w-4 h-4 bg-[#FF6B00] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {activeCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {["category","hostel","condition","search"].map(k => {
                const v = searchParams.get(k);
                if (!v) return null;
                return (
                  <span key={k} className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#151521] text-[#FF6B00] border border-[#1E1E2E] px-2.5 py-1 rounded-full">
                    {v}
                    <button onClick={() => updateFilter(k, null)} className="hover:text-white transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-[#0D0D1A] p-4 overflow-y-auto shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">Filters</h3>
              <button onClick={() => setShowFilters(false)}
                className="p-1.5 rounded-lg hover:bg-[#1E1E2E] text-[#9CA3AF] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <FilterSidebar inline filters={filters} onFilterChange={(k,v) => { updateFilter(k,v); setShowFilters(false); }} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="section py-6">
        <div className="flex gap-6">
          <FilterSidebar filters={filters} onFilterChange={updateFilter} />
          <div className="flex-1 min-w-0">
            <ProductGrid products={data?.products ?? []} isLoading={isLoading} isError={isError} />
            {data && (
              <Pagination
                currentPage={data.page}
                totalPages={data.totalPages}
                onPageChange={p => updateFilter("page", String(p))}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-40">
        <div className="w-8 h-8 border-2 border-[#FF6B00] border-t-[#FF6B00] rounded-full animate-spin" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
