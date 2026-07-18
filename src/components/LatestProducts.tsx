"use client";
import { memo } from "react";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import { Sparkles } from "lucide-react";

function LatestProducts() {
  const { data, isLoading } = useProducts({ limit: 8, page: 1 });
  const products = data?.products ?? [];

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="section py-6 sm:py-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#151521] rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#FF8C00]" />
          </div>
          <h2 className="section-title">Latest Listings</h2>
        </div>
        <Link href="/products" className="text-xs font-semibold text-[#FF8C00] hover:text-[#FF6B00] transition-colors">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-60 bg-[#151521] rounded-2xl border border-white/[0.06] animate-pulse"
              />
            ))
          : (data?.products ?? []).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
      </div>
    </section>
  );
}

export default memo(LatestProducts);
