"use client";
import { useWishlist } from "@/hooks/useWishlist";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import WishlistButton from "@/components/WishlistButton";
import { CATEGORY_IMAGES } from "@/components/ProductCard";
import type { Product } from "@/types";

function WishlistCard({ p }: { p: Product }) {
  const imgSrc = p.images?.[0] || CATEGORY_IMAGES[p.category] || CATEGORY_IMAGES.Other;
  return (
    <div className="group relative bg-[#151521] border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200">
      <Link href={`/product/${p.id}`}>
        <div className="relative aspect-square overflow-hidden bg-[#151521]">
          <img
            src={imgSrc}
            alt={p.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = CATEGORY_IMAGES[p.category] ?? CATEGORY_IMAGES.Other;
            }}
          />
          {p.sold && (
            <div className="absolute inset-0 bg-[#0D0D1A]/70 flex items-center justify-center">
              <span className="text-xs font-bold bg-[#FF6B00] text-white px-2.5 py-1 rounded-full">SOLD</span>
            </div>
          )}
        </div>
      </Link>
      <div className="absolute top-2 right-2">
        <WishlistButton productId={p.id} size="sm" />
      </div>
      <div className="p-3">
        <Link href={`/product/${p.id}`}>
          <p className="text-sm font-semibold text-white/90 line-clamp-2 leading-snug hover:text-[#FF8C00] transition-colors">{p.title}</p>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <p className="text-base font-bold text-[#FF8C00]">₹{p.price.toLocaleString()}</p>
          <span className="text-xs text-white/40 font-medium">{p.hostel}</span>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { ids } = useWishlist();

  // Only fetch products when there is something in the wishlist.
  // Previously this fetched 100 products unconditionally and filtered client-side,
  // wasting bandwidth on every page load even for users with empty wishlists.
  const { data } = useQuery({
    queryKey: ["products", { limit: 100 }],
    queryFn: () => fetchProducts({ limit: 100 }),
    enabled: ids.length > 0,
    staleTime: 60 * 1000,
  });

  const allProducts = data?.products ?? [];
  const wishlisted = allProducts.filter(p => ids.includes(p.id));

  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Wishlist</h1>
            <p className="text-sm text-white/40">{ids.length} saved item{ids.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {ids.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="w-20 h-20 rounded-3xl bg-[#151521] flex items-center justify-center">
              <Heart className="w-9 h-9 text-[#6B7280]" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-white text-lg">Nothing saved yet</p>
              <p className="text-white/40 text-sm mt-1">Tap the heart on any listing to save it here</p>
            </div>
            <Link href="/products"
              className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#FF8500] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm">
              <ShoppingBag className="w-4 h-4" />
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {wishlisted.map(p => <WishlistCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
