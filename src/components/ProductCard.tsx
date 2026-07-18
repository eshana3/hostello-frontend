"use client";
import Link from "next/link";
import Image from "next/image";
import { memo, useState } from "react";
import type { Product } from "@/types";
import WishlistButton from "./WishlistButton";
import { motion } from "framer-motion";

interface ProductCardProps { product: Product; }

export const CATEGORY_IMAGES: Record<string, string> = {
  Electronics:        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=400&fit=crop",
  Books:              "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
  Clothes:            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
  Snacks:             "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop",
  "Daily essentials": "https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=400&h=400&fit=crop",
  Accessories:        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
  Sports:             "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=400&fit=crop",
  Appliances:         "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
  Furniture:          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
  Food:               "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop",
  Other:              "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
};

const CONDITION_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  "new":      { bg: "rgba(16,185,129,0.10)",  color: "#34D399", border: "rgba(16,185,129,0.25)" },
  "like_new": { bg: "rgba(16,185,129,0.10)",  color: "#34D399", border: "rgba(16,185,129,0.25)" },
  "good":     { bg: "rgba(59,130,246,0.10)",  color: "#60A5FA", border: "rgba(59,130,246,0.25)" },
  "fair":     { bg: "rgba(245,158,11,0.10)",  color: "#FBBF24", border: "rgba(245,158,11,0.25)" },
  "poor":     { bg: "rgba(239,68,68,0.10)",   color: "#F87171", border: "rgba(239,68,68,0.25)" },
};

const CONDITION_LABEL: Record<string, string> = {
  "new":      "New",
  "like_new": "Like New",
  "good":     "Good",
  "fair":     "Fair",
  "poor":     "Poor",
};

function ProductCard({ product: p }: ProductCardProps) {
  const cond = CONDITION_STYLE[p.condition];
  const fallbackSrc = CATEGORY_IMAGES[p.category] ?? CATEGORY_IMAGES.Other;
  const initialSrc: string = (p as any).imageUrl ?? (p.images?.[0] || fallbackSrc);
  const [imgSrc, setImgSrc] = useState(initialSrc);

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl"
      style={{
        background: "rgba(11,15,23,0.95)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.25)",
        // No backdropFilter — it creates a GPU compositing layer for every card
        // in the grid. The solid near-opaque background achieves the same visual
        // result without the GPU overhead.
      }}
      whileHover={{
        y: -5,
        boxShadow: "0 16px 48px rgba(0,0,0,0.50), 0 4px 16px rgba(255,122,24,0.10), 0 0 0 1px rgba(255,122,24,0.12)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.20, ease: "easeOut" }}
    >
      {/* Image */}
      <Link href={`/product/${p.id}`}>
        <div className="relative aspect-square overflow-hidden" style={{ background: "#06070A" }}>
          {/*
           * next/image: automatic lazy loading, responsive srcset, and
           * format optimization (webp/avif) — this component renders many
           * times per page (grids, carousels), so it's the highest-leverage
           * place to cut image payload and keep scroll smooth on mobile.
           */}
          <Image
            src={imgSrc}
            alt={p.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            loading="lazy"
            className="object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
            onError={() => setImgSrc(fallbackSrc)}
          />
          <div
            className="absolute inset-0 group-hover:opacity-0 transition-opacity duration-300"
            style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.15) 100%)" }}
          />

          {(p as any).sold && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(2px)" }}>
              <span className="text-xs font-bold text-white/80 px-3 py-1 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.20)", background: "rgba(255,255,255,0.08)" }}>SOLD</span>
            </div>
          )}

          {cond && (
            <div className="absolute top-2.5 left-2.5">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: cond.bg, color: cond.color, border: `1px solid ${cond.border}` }}
              >
                {CONDITION_LABEL[p.condition] ?? p.condition}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Wishlist */}
      <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <WishlistButton productId={p.id} size="sm" />
      </div>

      {/* Info */}
      <div className="p-3 sm:p-3.5">
        <Link href={`/product/${p.id}`}>
          <p className="text-[12.5px] sm:text-[13px] font-semibold text-white/85 line-clamp-2 leading-snug hover:text-white transition-colors mb-1.5 sm:mb-2">
            {p.title}
          </p>
        </Link>
        <div className="flex items-center justify-between">
          <p
            className="text-base font-black bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #FF9B3D 0%, #FF7A18 100%)" }}
          >
            ₹{p.price.toLocaleString()}
          </p>
          <span className="text-[11px] text-white/25 font-medium">
            {(p as any).hostelId ?? (typeof p.hostel === "object" ? (p.hostel as any)?.name : p.hostel)}
          </span>
        </div>
        {(p as any).negotiable && (
          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,155,61,0.55)" }}>Negotiable</p>
        )}
      </div>
    </motion.div>
  );
}

// Memoize: prevents re-renders when parent state changes but this product hasn't changed
export default memo(ProductCard);
