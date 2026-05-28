"use client";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { useProducts } from "@/hooks/useProducts";
import type { ProductFilters } from "@/types";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { useState } from "react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const [showFilters, setShowFilters] = useState(false);

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

  const activeCount = ["category","hostel","condition","minPrice","maxPrice","search"]
    .filter(k => searchParams.get(k)).length;

  return (
    <div className="min-h-screen bg-[#080912]">
      {/* Page header */}
      <div className="bg-[#13112A] border-b border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="section py-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                {filters.category ?? "All Products"}
              </h1>
              {data && (
                <p className="text-xs text-[#5E5B82] mt-0.5 font-medium">
                  {data.total} listing{data.total !== 1 ? "s" : ""} found
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5E5B82] w-3.5 h-3.5" />
                <input type="text" placeholder="Search listings…"
                  defaultValue={filters.search ?? ""}
                  onKeyDown={e => {
                    if (e.key === "Enter") updateFilter("search", (e.target as HTMLInputElement).value || null);
                  }}
                  className="pl-9 pr-4 py-2 text-sm border border-white/[0.08] rounded-xl bg-[#1A1830] text-[#B5B2D8] placeholder-slate-300 focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#4C3699] transition-all shadow-sm w-48"
                />
              </div>

              {/* Mobile filter button */}
              <button onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 border border-white/[0.08] rounded-xl px-3 py-2 text-sm font-medium text-white/60 bg-[#1A1830] shadow-sm transition-all">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
                {activeCount > 0 && (
                  <span className="w-4 h-4 bg-[#7C3AED] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
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
                  <span key={k} className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#2D1B69] text-[#8B5CF6] border border-[#3D2785] px-2.5 py-1 rounded-full">
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
          <div className="absolute right-0 top-0 h-full w-72 bg-[#080912] p-4 overflow-y-auto shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">Filters</h3>
              <button onClick={() => setShowFilters(false)}
                className="p-1.5 rounded-lg hover:bg-[#1A1830] text-[#7B78A0] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <FilterSidebar filters={filters} onFilterChange={(k,v) => { updateFilter(k,v); setShowFilters(false); }} />
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
        <div className="w-8 h-8 border-2 border-[#4C3699] border-t-[#7C3AED] rounded-full animate-spin" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
