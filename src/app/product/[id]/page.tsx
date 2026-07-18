"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProductById, authFetch } from "@/lib/api";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useAuth } from "@/providers/AuthProvider";
import ImageGallery from "@/components/ImageGallery";
import WishlistButton from "@/components/WishlistButton";
import RelatedProducts from "@/components/RelatedProducts";
import {
  MapPin, Tag, Clock, MessageCircle, CheckCircle, ArrowLeft,
  ShieldCheck, Eye, MessageSquare, Loader2, Pencil, Trash2, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { toast } from "sonner";
import { CATEGORY_IMAGES } from "@/components/ProductCard";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { add } = useRecentlyViewed();
  const [startingChat, setStartingChat] = useState(false);
  const [markingSold, setMarkingSold] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (data?.product) add(data.product);
  }, [data?.product, add]);

  const handleStartChat = async () => {
    if (!data?.product) return;
    setStartingChat(true);
    try {
      const res = await authFetch("/api/chats", {
        method: "POST",
        body: JSON.stringify({
          productId: data.product.id,
          sellerId: data.product.seller?.id,
          sellerName: data.product.seller?.name,
          productTitle: data.product.title,
          productImageUrl: data.product.images?.[0],
        }),
      });

      // Always check HTTP status before trusting the body —
      // a 4xx/5xx response would leave startingChat=true forever without this.
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? `Server error ${res.status}`);
      }

      const chat = await res.json();
      const chatId = chat.id ?? chat._id;
      if (!chatId) throw new Error("Invalid chat response from server");

      router.push(`/chats/${chatId}`);
    } catch (err) {
      console.error("Failed to start chat:", err);
      setStartingChat(false);
    }
  };

  const handleMarkSold = async () => {
    if (!data?.product) return;
    setMarkingSold(true);
    try {
      const res = await authFetch(`/api/products/${data.product.id}/sold`, { method: "PATCH" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? "Failed to mark as sold");
      }
      await queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast.success("Listing marked as sold!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to mark as sold");
    } finally {
      setMarkingSold(false);
    }
  };

  const handleDelete = async () => {
    if (!data?.product) return;
    setDeleting(true);
    try {
      const res = await authFetch(`/api/products/${data.product.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? "Failed to delete listing");
      }
      toast.success("Listing deleted");
      router.push("/selling-history");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete listing");
      setDeleting(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-[#FF8C00] animate-spin" />
        <p className="text-white/40 text-sm font-medium">Loading listing…</p>
      </div>
    </div>
  );

  if (isError || !data) return (
    <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
      <div className="text-center">
        <p className="text-white/50 mb-4 font-medium">Listing not found.</p>
        <button onClick={() => router.back()} className="text-[#FF8C00] hover:text-[#FF6B00] font-semibold text-sm transition-colors">← Go back</button>
      </div>
    </div>
  );

  const { product: p, related } = data;
  const isOwner = !!user?._id && user._id === p.seller?.id;

  const images = (p.images?.length)
    ? p.images
    : [CATEGORY_IMAGES[p.category] ?? CATEGORY_IMAGES.Other];

  const conditionStyles: Record<string, string> = {
    "new":      "bg-emerald-900/20 text-emerald-400 border-emerald-800/40",
    "like_new": "bg-emerald-900/20 text-emerald-400 border-emerald-800/40",
    "good":     "bg-blue-900/20 text-blue-400 border-blue-800/40",
    "fair":     "bg-orange-900/20 text-orange-400 border-orange-800/40",
    "poor":     "bg-red-900/20 text-red-400 border-red-800/40",
  };

  const conditionLabel: Record<string, string> = {
    "new":      "New",
    "like_new": "Like New",
    "good":     "Good",
    "fair":     "Fair",
    "poor":     "Poor",
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A]">
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
                    <span className="text-[11px] font-bold bg-[#FF6B00] text-white px-2.5 py-1 rounded-full tracking-wide">SOLD</span>
                  )}
                  <span className={clsx("text-[11px] font-semibold px-2.5 py-1 rounded-full border", conditionStyles[p.condition] ?? "bg-[#151521] text-white/60 border-white/10")}>
                    {conditionLabel[p.condition] ?? p.condition}
                  </span>
                  {p.negotiable && (
                    <span className="text-[11px] font-semibold bg-[#151521] text-[#FF6B00] border border-[#FF6B00] px-2.5 py-1 rounded-full">Negotiable</span>
                  )}
                </div>
                <h1 className="text-2xl font-extrabold text-white leading-snug tracking-tight">{p.title}</h1>
              </div>
              <WishlistButton productId={p.id} size="md" className="flex-shrink-0 mt-1" />
            </div>

            {/* Price */}
            <div className="bg-[#151521] border border-white/[0.08] rounded-2xl px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#FF8C00]">₹{p.price.toLocaleString()}</span>
                {p.negotiable && <span className="text-sm text-white/40">· negotiable</span>}
              </div>
            </div>

            {/* Meta */}
            <div className="bg-[#151521] border border-white/[0.08] rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <MapPin className="w-4 h-4 text-[#FFD4A0] flex-shrink-0" />
                <span>From <span className="font-semibold text-white">{p.hostel}</span></span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <Tag className="w-4 h-4 text-[#FFD4A0] flex-shrink-0" />
                <span>Category: <span className="font-semibold text-white">{p.category}</span></span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <Eye className="w-4 h-4 text-[#FFD4A0] flex-shrink-0" />
                <span><span className="font-semibold text-white">{p.views ?? 0}</span> views</span>
              </div>
              {p.createdAt && (
                <div className="flex items-center gap-2.5 text-sm text-white/50">
                  <Clock className="w-4 h-4 text-[#FFD4A0] flex-shrink-0" />
                  <span>Listed <span className="font-semibold text-white">{new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></span>
                </div>
              )}
            </div>

            {/* Description */}
            {p.description && (
              <div className="bg-[#151521] border border-white/[0.08] rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Description</h3>
                <p className="text-sm text-white/60 leading-relaxed">{p.description}</p>
              </div>
            )}

            {/* Seller */}
            <Link href={`/seller/${p.seller?.id}`}
              className="bg-[#151521] border border-white/[0.08] rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-[#FF6B00] hover:shadow-[0_4px_16px_rgba(99,102,241,0.08)] transition-all duration-200 flex items-center gap-3 group">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.seller?.name ?? "")}&backgroundColor=7C3AED`}
                alt={p.seller?.name ?? "Seller"}
                className="w-11 h-11 rounded-full bg-[#1E1E2E] flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-[#FF8C00] transition-colors">{p.seller?.name}</p>
                <p className="text-xs text-white/40 mt-0.5">{p.hostel} · View profile →</p>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            </Link>

            {/* CTA */}
            {isOwner ? (
              <div className="flex flex-col gap-2.5">
                <div className="flex gap-2.5">
                  <Link
                    href={`/sell?edit=${p.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#1E1E2E] border border-white/[0.08] hover:border-[#FF6B00]/40 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-150 text-sm">
                    <Pencil className="w-4 h-4" /> Edit
                  </Link>
                  {!p.sold && (
                    <button
                      onClick={handleMarkSold}
                      disabled={markingSold}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-150 text-sm">
                      {markingSold
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <CheckCircle className="w-4 h-4" />}
                      Mark Sold
                    </button>
                  )}
                </div>

                {!confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="w-full flex items-center justify-center gap-2 bg-[#151521] border border-rose-900/40 hover:bg-rose-500/10 text-rose-400 font-semibold py-3 px-4 rounded-xl transition-all duration-150 text-sm">
                    <Trash2 className="w-4 h-4" /> Delete Listing
                  </button>
                ) : (
                  <div className="bg-[#151521] border border-rose-900/40 rounded-xl p-4">
                    <p className="flex items-center gap-2 text-sm text-white/60 mb-3">
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      This cannot be undone.
                    </p>
                    <div className="flex gap-2.5">
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors">
                        {deleting ? "Deleting…" : "Yes, delete"}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors bg-white/[0.08] hover:bg-white/[0.12]">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : !p.sold ? (
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleStartChat}
                  disabled={startingChat}
                  className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#FF8500] disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition-all duration-150 text-sm">
                  {startingChat
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Opening chat…</>
                    : <><MessageSquare className="w-4 h-4" /> Chat with Seller</>}
                </button>
                <a
                  href={`https://wa.me/?text=Hi! I'm interested in your listing: ${encodeURIComponent(p.title)} for ₹${p.price} on Hostel Mart.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#1E1E2E] border border-[#1E1E2E] hover:border-emerald-500/40 hover:bg-emerald-900/20 text-[#C9D1D9] font-semibold py-3 px-4 rounded-xl transition-all duration-150 text-sm">
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  Chat on WhatsApp
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 text-sm text-white/40 bg-[#151521] border border-white/[0.08] rounded-xl px-4 py-3">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                This item has already been sold
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        <div className="bg-[#151521] border border-white/[0.08] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <RelatedProducts products={related} />
        </div>
      </div>
    </div>
  );
}
