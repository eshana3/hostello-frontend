"use client";
import Link from "next/link";
import type { Product } from "@/types";
import WishlistButton from "./WishlistButton";

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products.length) return null;

  return (
    <section>
      <h2 className="text-sm font-bold text-[#5E5B82] uppercase tracking-widest mb-4">Related Listings</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {products.map(p => (
          <Link key={p.id} href={`/product/${p.id}`}
            className="group relative bg-[#13112A] border border-[#252248] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.30)] hover:shadow-[0_8px_32px_rgba(124,58,237,0.15)] hover:-translate-y-0.5 transition-all duration-200">
            <div className="relative aspect-square overflow-hidden bg-[#131425]">
              <img src={p.imageUrl} alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <WishlistButton productId={p.id} size="sm" />
              </div>
            </div>
            <div className="p-2.5">
              <p className="text-xs text-white font-medium line-clamp-2 leading-snug">{p.title}</p>
              <p className="text-sm font-bold text-[#A78BFA] mt-1">₹{p.price.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
