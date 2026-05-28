"use client";
import { useTrendingProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import { Flame } from "lucide-react";
import Link from "next/link";

export default function TrendingSection() {
  const { data: products, isLoading } = useTrendingProducts();

  return (
    <section className="bg-[#131425] border-y border-white/[0.08] py-10">
      <div className="section">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="section-title">Trending Now</h2>
          </div>
          <Link href="/products" className="text-xs font-semibold text-[#A78BFA] hover:text-[#8B5CF6] transition-colors">
            See all →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-hide">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="min-w-[180px] h-60 bg-[#13112A] rounded-2xl border border-white/[0.08] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-hide">
            {(products ?? []).map((p) => (
              <div key={p.id} className="min-w-[190px] max-w-[190px] flex-shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
