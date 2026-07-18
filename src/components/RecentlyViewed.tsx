"use client";
import Link from "next/link";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { History } from "lucide-react";

export default function RecentlyViewed() {
  const { products, clear } = useRecentlyViewed();
  if (!products.length) return null;

  return (
    <section className="section py-6 sm:py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#1E1E2E] rounded-lg flex items-center justify-center">
            <History className="w-3.5 h-3.5 text-[#9CA3AF]" />
          </div>
          <h2 className="text-base font-bold text-white">Recently Viewed</h2>
        </div>
        <button onClick={clear}
          className="text-xs text-[#9CA3AF] hover:text-[#9CA3AF] font-medium transition-colors px-2 py-1 rounded-lg hover:bg-[#1E1E2E]">
          Clear
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {products.map(p => (
          <Link key={p.id} href={`/product/${p.id}`}
            className="flex-shrink-0 w-32 group">
            <div className="aspect-square rounded-xl overflow-hidden bg-[#151521] border border-white/[0.08] mb-2 group-hover:shadow-md transition-all">
              <img src={p.images?.[0]} alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <p className="text-[11px] text-[#9CA3AF] font-medium line-clamp-2 leading-snug">{p.title}</p>
            <p className="text-xs font-black text-white mt-0.5">₹{p.price.toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
