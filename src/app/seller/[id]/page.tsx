"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchSellerById } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, MapPin, ShieldCheck, Star, Package, CheckCircle } from "lucide-react";
import type { Product } from "@/types";
import WishlistButton from "@/components/WishlistButton";
import clsx from "clsx";

function ProductMini({ p }: { p: Product }) {
  return (
    <Link href={`/product/${p.id}`}
      className="group relative bg-[#151521] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.30)] hover:shadow-[0_8px_32px_rgba(255,107,0,0.15)] hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative aspect-square overflow-hidden bg-[#151521]">
        <img src={p.imageUrl} alt={p.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        {p.sold && (
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

export default function SellerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<"active" | "sold">("active");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["seller", id],
    queryFn: () => fetchSellerById(id),
    enabled: !!id,
  });

  if (isLoading) return (
    <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#FF6B00] border-t-[#FF6B00] rounded-full animate-spin" />
    </div>
  );

  if (isError || !data) return (
    <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
      <p className="text-[#9CA3AF]">Seller not found.</p>
    </div>
  );

  const { seller, active, sold } = data;
  const listed = tab === "active" ? active : sold;

  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <button onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-[#D4D1F0] mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Profile card */}
        <div className="bg-[#151521] border border-white/[0.08] rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-5">
            <img src={seller.avatar} alt={seller.name}
              className="w-20 h-20 rounded-2xl bg-[#1E1E2E] shadow" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-[#D4D1F0]">{seller.name}</h1>
                <ShieldCheck className="w-4 h-4 text-emerald-500" title="Verified" />
              </div>
              <div className="flex items-center gap-1.5 text-sm text-[#9CA3AF] mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{seller.hostelId}</span>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-1">Member since {seller.memberSince}</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-100">
            <div className="text-center">
              <p className="text-2xl font-black text-[#FF8C00]">{seller.totalListings}</p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">Total Listings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-emerald-600">{seller.soldListings}</p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">Items Sold</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-[#FF8C00]">{seller.responseRate}</p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">Response Rate</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {(["active", "sold"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={clsx(
                "px-5 py-2 rounded-xl text-sm font-semibold transition-all",
                tab === t
                  ? "bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]"
                  : "bg-[#151521] border border-[#1E1E2E] text-[#9CA3AF] hover:border-[#FF6B00]"
              )}>
              {t === "active" ? `Active (${active.length})` : `Sold (${sold.length})`}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {listed.length === 0 ? (
          <div className="text-center py-16 text-[#9CA3AF]">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No {tab} listings</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {listed.map(p => <ProductMini key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
