"use client";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import { Sparkles } from "lucide-react";

export default function LatestProducts() {
  const { data, isLoading } = useProducts({ limit: 8, page: 1 });

  return (
    <section className="section py-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#2D1B69] rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#A78BFA]" />
          </div>
          <h2 className="section-title">Latest Listings</h2>
        </div>
        <Link href="/products" className="text-xs font-semibold text-[#A78BFA] hover:text-[#8B5CF6] transition-colors">
          View all →
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-60 bg-[#13112A] rounded-2xl border border-white/[0.08] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {(data?.products ?? []).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
