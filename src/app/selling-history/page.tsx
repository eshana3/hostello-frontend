"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchSellerById } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import { ArrowLeft, Package, ShoppingBag, CheckCircle, Plus } from "lucide-react";
import type { Product } from "@/types";
import WishlistButton from "@/components/WishlistButton";
import clsx from "clsx";

function ListingCard({ p }: { p: Product }) {
  return (
    <Link href={`/product/${p.id}`}
      className="group relative bg-[#151521] border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.30)] hover:shadow-[0_8px_32px_rgba(255,107,0,0.15)] hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative aspect-square overflow-hidden bg-[#151521]">
        <img src={(p as any).imageUrl} alt={p.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        {(p as any).sold && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs font-bold">SOLD</span>
          </div>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <WishlistButton productId={p.id} size="sm" />
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-[#C9D1D9] line-clamp-2 leading-snug">{p.title}</p>
        <p className="text-base font-bold text-[#FF8C00] mt-1">₹{p.price.toLocaleString()}</p>
        <p className="text-xs text-[#9CA3AF] mt-0.5">{p.condition}</p>
      </div>
    </Link>
  );
}

export default function SellingHistoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [tab, setTab] = useState<"active" | "sold">("active");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["seller", user?._id],
    queryFn: () => fetchSellerById(user!._id!),
    enabled: !!user?._id,
  });

  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => router.back()}
          className="flex items-center gap-1.5 text-white/40 hover:text-white mb-6 transition-colors group text-sm font-medium">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Selling History</h1>
            <p className="text-sm text-white/40 mt-0.5">Everything you&apos;ve listed on HostelMart</p>
          </div>
          <Link href="/sell"
            className="flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
            style={{ background: "linear-gradient(135deg, #FF9B3D 0%, #FF7A18 100%)", boxShadow: "0 4px 16px rgba(255,122,24,0.35)" }}>
            <Plus className="w-4 h-4" /> New Listing
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError || !data ? (
          <p className="text-center text-white/40 py-24">Failed to load your listings. Try again.</p>
        ) : (
          <>
            {/* Stat row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#151521] border border-white/[0.08] rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,122,24,0.12)" }}>
                  <ShoppingBag className="w-5 h-5 text-[#FF9B3D]" />
                </div>
                <div>
                  <p className="text-xl font-black text-white leading-none">{data.active.length}</p>
                  <p className="text-xs text-white/40 mt-1">Active Listings</p>
                </div>
              </div>
              <div className="bg-[#151521] border border-white/[0.08] rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-900/30">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xl font-black text-white leading-none">{data.sold.length}</p>
                  <p className="text-xs text-white/40 mt-1">Sold Items</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-5">
              {(["active", "sold"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={clsx(
                    "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                    tab === t
                      ? "bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/20"
                      : "bg-[#151521] border border-white/[0.08] text-white/50 hover:border-[#FF6B00]/40"
                  )}
                >
                  {t === "active" ? `Active (${data.active.length})` : `Sold (${data.sold.length})`}
                </button>
              ))}
            </div>

            {/* Grid */}
            {(tab === "active" ? data.active : data.sold).length === 0 ? (
              <div className="text-center py-16 text-white/40">
                <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No {tab} listings yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {(tab === "active" ? data.active : data.sold).map((p) => (
                  <ListingCard key={p.id} p={p} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
