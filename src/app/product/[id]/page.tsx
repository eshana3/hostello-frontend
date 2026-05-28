"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "@/lib/api";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import ImageGallery from "@/components/ImageGallery";
import WishlistButton from "@/components/WishlistButton";
import RelatedProducts from "@/components/RelatedProducts";
import {
  MapPin, Tag, Clock, MessageCircle, CheckCircle, ArrowLeft,
  ShieldCheck, Eye, MessageSquare, Loader2
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { add } = useRecentlyViewed();
  const [startingChat, setStartingChat] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (data?.product) add(data.product);
  }, [data?.product]);

  const handleStartChat = async () => {
    if (!data?.product) return;
    setStartingChat(true);
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: data.product.id,
          sellerId: data.product.sellerId,
          sellerName: data.product.sellerName,
          productTitle: data.product.title,
          productImageUrl: data.product.imageUrl,
        }),
      });
      const chat = await res.json();
      router.push(`/chats/${chat.id}`);
    } catch {
      setStartingChat(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#080912] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-[#A78BFA] animate-spin" />
        <p className="text-white/40 text-sm font-medium">Loading listing…</p>
      </div>
    </div>
  );

  if (isError || !data) return (
    <div className="min-h-screen bg-[#080912] flex items-center justify-center">
      <div className="text-center">
        <p className="text-white/50 mb-4 font-medium">Listing not found.</p>
        <button onClick={() => router.back()} className="text-[#A78BFA] hover:text-[#7C3AED] font-semibold text-sm transition-colors">← Go back</button>
      </div>
    </div>
  );

  const { product: p, related } = data;

  const images = p.imageUrl
    ? [p.imageUrl, p.imageUrl, p.imageUrl]
    : ["https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80"];

  const conditionStyles: Record<string, string> = {
    "Like New": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Good":     "bg-blue-50 text-blue-700 border-blue-200",
    "Fair":     "bg-amber-50 text-amber-700 border-amber-200",
    "Poor":     "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="min-h-screen bg-[#080912]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

        {/* Back */}
        <button onClick={() => router.back()}
          className="flex items-center gap-1.5 text-white/40 hover:text-white mb-6 transition-colors group text-sm font-medium">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Gallery */}
          <div>
            <ImageGallery images={images} alt={p.title} />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">

            {/* Title + badges */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                  {p.sold && (
                    <span className="text-[11px] font-bold bg-[#7C3AED] text-white px-2.5 py-1 rounded-full tracking-wide">SOLD</span>
                  )}
                  <span className={clsx("text-[11px] font-semibold px-2.5 py-1 rounded-full border", conditionStyles[p.condition] ?? "bg-[#13112A] text-white/60 border-slate-200")}>
                    {p.condition}
                  </span>
                  {p.negotiable && (
                    <span className="text-[11px] font-semibold bg-[#2D1B69] text-[#8B5CF6] border border-[#4C3699] px-2.5 py-1 rounded-full">Negotiable</span>
                  )}
                </div>
                <h1 className="text-2xl font-extrabold text-white leading-snug tracking-tight">{p.title}</h1>
              </div>
              <WishlistButton productId={p.id} size="md" className="flex-shrink-0 mt-1" />
            </div>

            {/* Price */}
            <div className="bg-[#131425] border border-white/[0.08] rounded-2xl px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#A78BFA]">₹{p.price.toLocaleString()}</span>
                {p.negotiable && <span className="text-sm text-white/40">· negotiable</span>}
              </div>
            </div>

            {/* Meta */}
            <div className="bg-[#131425] border border-white/[0.08] rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <MapPin className="w-4 h-4 text-[#C4B5FD] flex-shrink-0" />
                <span>From <span className="font-semibold text-white">{p.hostelId}</span></span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <Tag className="w-4 h-4 text-[#C4B5FD] flex-shrink-0" />
                <span>Category: <span className="font-semibold text-white">{p.category}</span></span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <Eye className="w-4 h-4 text-[#C4B5FD] flex-shrink-0" />
                <span><span className="font-semibold text-white">{p.views ?? 0}</span> views</span>
              </div>
              {p.createdAt && (
                <div className="flex items-center gap-2.5 text-sm text-white/50">
                  <Clock className="w-4 h-4 text-[#C4B5FD] flex-shrink-0" />
                  <span>Listed <span className="font-semibold text-white">{new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></span>
                </div>
              )}
            </div>

            {/* Description */}
            {p.description && (
              <div className="bg-[#131425] border border-white/[0.08] rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Description</h3>
                <p className="text-sm text-white/60 leading-relaxed">{p.description}</p>
              </div>
            )}

            {/* Seller */}
            <Link href={`/seller/${p.sellerId}`}
              className="bg-[#131425] border border-white/[0.08] rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-[#4C3699] hover:shadow-[0_4px_16px_rgba(99,102,241,0.08)] transition-all duration-200 flex items-center gap-3 group">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.sellerName)}&backgroundColor=7C3AED`}
                alt={p.sellerName}
                className="w-11 h-11 rounded-full bg-[#3D2785] flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-[#A78BFA] transition-colors">{p.sellerName}</p>
                <p className="text-xs text-white/40 mt-0.5">{p.hostelId} · View profile →</p>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            </Link>

            {/* CTA */}
            {!p.sold ? (
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleStartChat}
                  disabled={startingChat}
                  className="w-full flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#161725] disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition-all duration-150 text-sm">
                  {startingChat
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Opening chat…</>
                    : <><MessageSquare className="w-4 h-4" /> Chat with Seller</>}
                </button>
                <a
                  href={`https://wa.me/?text=Hi! I'm interested in your listing: ${encodeURIComponent(p.title)} for ₹${p.price} on Hostello.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#1A1830] border border-[#252248] hover:border-emerald-500/40 hover:bg-emerald-900/20 text-[#B5B2D8] font-semibold py-3 px-4 rounded-xl transition-all duration-150 text-sm">
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  Chat on WhatsApp
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 text-sm text-white/40 bg-[#131425] border border-white/[0.08] rounded-xl px-4 py-3">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                This item has already been sold
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        <div className="bg-[#13112A] border border-white/[0.08] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <RelatedProducts products={related} />
        </div>
      </div>
    </div>
  );
}
