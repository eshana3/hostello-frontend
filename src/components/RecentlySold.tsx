"use client";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import { BadgeCheck } from "lucide-react";

export default function RecentlySold() {
  const { data, isLoading } = useProducts({ sold: true, limit: 6 });
  if (!isLoading && !data?.products?.length) return null;

  return (
    <section className="bg-[#151521] border-y border-white/[0.08] py-6 sm:py-10">
      <div className="section">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 bg-emerald-900/40 rounded-lg flex items-center justify-center">
            <BadgeCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <h2 className="section-title">Recently Sold</h2>
          <span className="badge bg-emerald-900/30 text-emerald-400 border border-emerald-700/40 ml-1">Sold out fast</span>
        </div>
        {isLoading ? (
          <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-hide">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-[180px] h-60 bg-[#151521] rounded-2xl border border-white/[0.08] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-hide">
            {(data?.products ?? []).map((p) => (
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
