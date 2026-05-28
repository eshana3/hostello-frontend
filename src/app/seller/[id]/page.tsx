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
      className="group relative bg-[#13112A] border border-[#252248] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.30)] hover:shadow-[0_8px_32px_rgba(124,58,237,0.15)] hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative aspect-square overflow-hidden bg-[#131425]">
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
        <p className="text-sm font-medium text-[#B5B2D8] line-clamp-2 leading-snug">{p.title}</p>
        <p className="text-base font-bold text-[#A78BFA] mt-1">₹{p.price.toLocaleString()}</p>
        <p className="text-xs text-[#5E5B82] mt-0.5">{p.condition}</p>
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
    <div className="min-h-screen bg-[#080912] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#4C3699] border-t-[#7C3AED] rounded-full animate-spin" />
    </div>
  );

  if (isError || !data) return (
    <div className="min-h-screen bg-[#080912] flex items-center justify-center">
      <p className="text-[#7B78A0]">Seller not found.</p>
    </div>
  );

  const { seller, active, sold } = data;
  const listed = tab === "active" ? active : sold;

  return (
    <div className="min-h-screen bg-[#080912]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <button onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[#7B78A0] hover:text-[#D4D1F0] mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Profile card */}
        <div className="bg-[#13112A] border border-white/[0.08] rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-5">
            <img src={seller.avatar} alt={seller.name}
              className="w-20 h-20 rounded-2xl bg-[#3D2785] shadow" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-[#D4D1F0]">{seller.name}</h1>
                <ShieldCheck className="w-4 h-4 text-emerald-500" title="Verified" />
              </div>
              <div className="flex items-center gap-1.5 text-sm text-[#7B78A0] mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{seller.hostelId}</span>
              </div>
              <p className="text-xs text-[#5E5B82] mt-1">Member since {seller.memberSince}</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-100">
            <div className="text-center">
              <p className="text-2xl font-black text-[#A78BFA]">{seller.totalListings}</p>
              <p className="text-xs text-[#7B78A0] mt-0.5">Total Listings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-emerald-600">{seller.soldListings}</p>
              <p className="text-xs text-[#7B78A0] mt-0.5">Items Sold</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-[#A78BFA]">{seller.responseRate}</p>
              <p className="text-xs text-[#7B78A0] mt-0.5">Response Rate</p>
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
                  ? "bg-[#7C3AED] text-white shadow-md shadow-[#4C3699]"
                  : "bg-[#13112A] border border-[#252248] text-[#7B78A0] hover:border-[#4C3699]"
              )}>
              {t === "active" ? `Active (${active.length})` : `Sold (${sold.length})`}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {listed.length === 0 ? (
          <div className="text-center py-16 text-[#5E5B82]">
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
