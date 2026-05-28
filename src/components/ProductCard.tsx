"use client";
import Link from "next/link";
import type { Product } from "@/types";
import WishlistButton from "./WishlistButton";
import clsx from "clsx";

interface ProductCardProps { product: Product; }

const CONDITION_STYLE: Record<string, string> = {
  "Like New": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Good":     "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Fair":     "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Poor":     "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function ProductCard({ product: p }: ProductCardProps) {
  return (
    <div className="group relative bg-[#131425] border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.30)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 transition-all duration-200">
      <Link href={`/product/${p.id}`}>
        <div className="relative aspect-square overflow-hidden bg-[#0D0E1C]">
          <img
            src={(p as any).imageUrl ?? (p.images?.[0] ?? "")}
            alt={p.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {(p as any).sold && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-xs font-bold bg-white/10 text-white/80 border border-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">SOLD</span>
            </div>
          )}
          {/* Condition badge */}
          <div className="absolute top-2 left-2">
            <span className={clsx(
              "text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm",
              CONDITION_STYLE[p.condition] ?? "bg-white/10 text-white/60 border-white/20"
            )}>
              {p.condition}
            </span>
          </div>
        </div>
      </Link>

      {/* Wishlist */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <WishlistButton productId={p.id} size="sm" />
      </div>

      <div className="p-3">
        <Link href={`/product/${p.id}`}>
          <p className="text-sm font-semibold text-white/90 line-clamp-2 leading-snug hover:text-white transition-colors">{p.title}</p>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <p className="text-base font-black text-[#A78BFA]">₹{p.price.toLocaleString()}</p>
          <span className="text-[11px] text-white/30 font-medium">{(p as any).hostelId ?? p.hostel}</span>
        </div>
        {(p as any).negotiable && (
          <p className="text-[10px] text-white/30 mt-0.5">Negotiable</p>
        )}
      </div>
    </div>
  );
}
