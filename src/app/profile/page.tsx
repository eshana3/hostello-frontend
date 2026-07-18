"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchMyPurchases } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { useWishlist } from "@/hooks/useWishlist";
import Link from "next/link";
import {
  User, MapPin, Mail, Receipt, PackageSearch, ShieldCheck, Settings,
  ShoppingBag, Heart, LogOut,
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const hostelName = typeof user?.hostel === "object" ? (user?.hostel as any)?.name : user?.hostel;

  const { data: purchases, isLoading } = useQuery({
    queryKey: ["purchases"],
    queryFn: fetchMyPurchases,
    staleTime: 60_000,
  });

  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        {/* Profile card */}
        <div className="bg-[#151521] border border-white/[0.08] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center gap-4">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl bg-[#1E1E2E] object-cover shrink-0" />
          ) : (
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,122,24,0.14)" }}>
              <User className="w-7 h-7 text-[#FF9B3D]" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold text-white truncate">{user?.name}</h1>
              {user?.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />}
            </div>
            {hostelName && (
              <p className="flex items-center gap-1.5 text-sm text-white/50 mt-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{hostelName}</span>
              </p>
            )}
            {user?.email && (
              <p className="flex items-center gap-1.5 text-sm text-white/40 mt-0.5">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <Link
            href="/selling-history"
            className="flex items-center gap-3 bg-[#151521] border border-white/[0.08] rounded-2xl px-4 py-3.5 hover:border-[#FF7A18]/30 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,122,24,0.12)" }}>
              <ShoppingBag className="w-4 h-4 text-[#FF9B3D]" />
            </div>
            <span className="flex-1 min-w-0 text-sm font-semibold text-white truncate">Selling History</span>
          </Link>

          <Link
            href="/wishlist"
            className="flex items-center gap-3 bg-[#151521] border border-white/[0.08] rounded-2xl px-4 py-3.5 hover:border-[#FF7A18]/30 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-rose-500/10">
              <Heart className="w-4 h-4 text-rose-400" />
            </div>
            <span className="flex-1 min-w-0 text-sm font-semibold text-white truncate">
              Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
            </span>
          </Link>

          <Link
            href="/settings"
            className="flex items-center gap-3 bg-[#151521] border border-white/[0.08] rounded-2xl px-4 py-3.5 hover:border-[#FF7A18]/30 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,122,24,0.12)" }}>
              <Settings className="w-4 h-4 text-[#FF9B3D]" />
            </div>
            <span className="flex-1 min-w-0 text-sm font-semibold text-white truncate">Settings</span>
          </Link>

          <button
            onClick={logout}
            className="flex items-center gap-3 bg-[#151521] border border-white/[0.08] rounded-2xl px-4 py-3.5 hover:border-rose-500/30 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-rose-500/10">
              <LogOut className="w-4 h-4 text-rose-400" />
            </div>
            <span className="flex-1 min-w-0 text-sm font-semibold text-rose-400 truncate">Log out</span>
          </button>
        </div>

        {/* Purchase History */}
        <div id="purchase-history" className="mt-8 scroll-mt-20">
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="w-4 h-4 text-[#FF9B3D]" />
            <h2 className="text-base font-bold text-white">Purchase History</h2>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-[#151521] border border-white/[0.08] rounded-2xl p-4 flex items-center gap-3">
                  <Skeleton className="w-14 h-14 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-2.5 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : !purchases || purchases.length === 0 ? (
            <div className="bg-[#151521] border border-white/[0.08] rounded-2xl flex flex-col items-center justify-center py-14 gap-3">
              <div className="w-16 h-16 rounded-2xl bg-[#1E1E2E] flex items-center justify-center">
                <PackageSearch className="w-8 h-8 text-[#6B7280]" />
              </div>
              <p className="text-white font-semibold">No purchases yet</p>
              <p className="text-white/40 text-sm text-center px-8">Items you buy from sellers will show up here</p>
              <Link
                href="/products"
                className="mt-1 text-sm font-semibold text-[#FF9B3D] hover:text-[#FF7A18] transition-colors"
              >
                Browse listings →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {purchases.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="bg-[#151521] border border-white/[0.08] rounded-2xl p-4 flex items-center gap-3 hover:border-[#FF7A18]/25 transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#1E1E2E] shrink-0">
                    {p.image && <img src={p.image} alt={p.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{p.title}</p>
                    <p className="text-xs text-white/40 mt-0.5 truncate">Seller: {p.sellerName}</p>
                    <p className="text-[11px] text-white/30 mt-0.5">{timeAgo(p.orderDate)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-[#FF8C00]">₹{p.price.toLocaleString()}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-800/40">
                      {p.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
