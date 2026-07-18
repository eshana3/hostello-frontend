"use client";
import { memo } from "react";
import { useTrendingProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import { Flame } from "lucide-react";
import Link from "next/link";

function TrendingSection() {
  const { data: products, isLoading } = useTrendingProducts();

  if (!isLoading && !products?.length) return null;

  return (
    <section className="bg-[#151521] border-y border-white/[0.08] py-6 sm:py-10">
      <div className="section">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-900/40 rounded-lg flex items-center justify-center">
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <h2 className="section-title">Trending Now</h2>
          </div>
          <Link href="/products" className="text-xs font-semibold text-[#FF8C00] hover:text-[#FF6B00] transition-colors">
            See all →
          </Link>
        </div>

        <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-hide">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[180px] h-60 bg-[#1a1a2e] rounded-2xl border border-white/[0.06] animate-pulse shrink-0"
                />
              ))
            : (products ?? []).map((p) => (
                <div key={p.id} className="min-w-[190px] max-w-[190px] flex-shrink-0">
                  <ProductCard product={p} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

export default memo(TrendingSection);
