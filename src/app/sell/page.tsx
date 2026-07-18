"use client";
import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Package, Upload, X, CheckCircle, Tag, IndianRupee,
  Home, FileText, Image as ImageIcon, Loader2, ArrowRight, AlertCircle,
} from "lucide-react";
import { QC_HOSTELS, KP_HOSTELS } from "@/lib/hostelUtils";
import { getAuthToken } from "@/providers/AuthProvider";
import { compressImage } from "@/lib/imageCompression";
import { toast } from "sonner";

const CATEGORIES = [
  "Electronics",
  "Clothes",
  "Snacks",
  "Accessories",
  "Books",
  "Daily essentials",
] as const;

const CONDITIONS = [
  { value: "new",      label: "New / Unopened" },
  { value: "like_new", label: "Like New" },
  { value: "good",     label: "Good" },
  { value: "fair",     label: "Fair" },
  { value: "poor",     label: "Poor" },
] as const;

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-[#1E1E2E] text-white placeholder-slate-400 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/30 transition-all text-sm shadow-sm";
const labelCls =
  "flex items-center gap-2 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-2";

interface FormState {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  negotiable: boolean;
  hostel: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  price: "",
  category: "",
  condition: "good",
  negotiable: false,
  hostel: "",
};

interface ExistingImage { url: string; public_id: string }

function SellForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitted, setSubmitted] = useState(false);
  const [submittedTitle, setSubmittedTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loadingProduct, setLoadingProduct] = useState(!!editId);
  const [loadProductError, setLoadProductError] = useState<string | null>(null);

  const totalImageCount = existingImages.length + imageFiles.length;

  // Edit mode: fetch the existing listing (raw, with image public_ids) and pre-fill the form
  useEffect(() => {
    if (!editId) return;
    let cancelled = false;
    setLoadingProduct(true);
    fetch(`/api/products/${editId}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load listing");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const product = data.product ?? data;
        setForm({
          title: product.title,
          description: product.description ?? "",
          price: String(product.price),
          category: product.category,
          condition: product.condition,
          negotiable: !!product.negotiable,
          hostel: typeof product.hostel === "object" && product.hostel !== null ? product.hostel.name ?? "" : product.hostel ?? "",
        });
        const imgs = (product.images ?? []) as (string | ExistingImage)[];
        setExistingImages(
          imgs.map((img) => (typeof img === "string" ? { url: img, public_id: "" } : img))
        );
      })
      .catch(() => {
        if (!cancelled) setLoadProductError("Couldn't load this listing. It may have been removed.");
      })
      .finally(() => {
        if (!cancelled) setLoadingProduct(false);
      });
    return () => { cancelled = true; };
  }, [editId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (error) setError(null);
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = 5 - totalImageCount;
    const accepted = files.slice(0, remaining);
    // Reset input immediately so the same file can be re-selected if removed
    e.target.value = "";

    // Show previews instantly from the original files — compression happens
    // in the background and swaps in the smaller file once ready, so the
    // user isn't stuck staring at a blank thumbnail while it processes.
    const startIndex = imageFiles.length;
    setImageFiles(prev => [...prev, ...accepted]);
    accepted.forEach(file => {
      const url = URL.createObjectURL(file);
      setImagePreviews(prev => [...prev, url]);
    });

    accepted.forEach((file, i) => {
      compressImage(file).then(compressed => {
        if (compressed === file) return; // nothing to swap, already optimal
        setImageFiles(prev => {
          const next = [...prev];
          next[startIndex + i] = compressed;
          return next;
        });
      });
    });
  }, [totalImageCount, imageFiles.length]);

  const removeImage = useCallback((idx: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  }, []);

  const removeExistingImage = useCallback((publicId: string) => {
    setExistingImages(prev => prev.filter(img => img.public_id !== publicId));
    setRemovedImageIds(prev => [...prev, publicId]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const token = getAuthToken();
    if (!token) {
      setError("You must be logged in to post a listing.");
      return;
    }

    setLoading(true);
    try {
      const body = new FormData();
      body.append("title",       form.title.trim());
      body.append("description", form.description.trim());
      body.append("price",       form.price);
      body.append("category",    form.category);
      body.append("condition",   form.condition);
      body.append("negotiable",  String(form.negotiable));
      body.append("hostel",      form.hostel);
      imageFiles.forEach(file => body.append("images", file));
      if (editId && removedImageIds.length > 0) {
        body.append("removedImageIds", removedImageIds.join(","));
      }

      const res = await fetch(editId ? `/api/products/${editId}` : "/api/products", {
        method: editId ? "PATCH" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        // Surface the server's specific message (spam, fraud, duplicate, validation errors)
        throw new Error(data.message ?? `Server error ${res.status}`);
      }

      // Clean up object URLs
      imagePreviews.forEach(url => URL.revokeObjectURL(url));

      if (editId) {
        await queryClient.invalidateQueries({ queryKey: ["product", editId] });
        toast.success("Listing updated successfully!");
        router.push(`/product/${editId}`);
        return;
      }

      setSubmittedTitle(form.title.trim());
      setForm(EMPTY_FORM);
      setImageFiles([]);
      setImagePreviews([]);
      setSubmitted(true);
      toast.success("Listing posted successfully!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center px-4">
        <div className="bg-[#151521] border border-white/[0.08] rounded-3xl p-10 max-w-md w-full text-center shadow-[0_4px_32px_rgba(0,0,0,0.08)]">
          <div className="w-16 h-16 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">Listing Created!</h2>
          <p className="text-[#9CA3AF] text-sm mb-6 leading-relaxed">
            Your item <span className="font-semibold text-white">&quot;{submittedTitle}&quot;</span> is now live.
            Students in your hostel can find it.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setSubmitted(false)}
              className="flex-1 border border-white/[0.08] text-[#9CA3AF] py-2.5 rounded-xl font-semibold hover:bg-[#1E1E2E] transition-colors text-sm">
              Sell Another
            </button>
            <button
              onClick={() => router.push("/products")}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold transition-colors text-sm shadow-sm">
              Browse Listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (loadProductError) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center px-4">
        <div className="bg-[#151521] border border-white/[0.08] rounded-3xl p-10 max-w-md w-full text-center shadow-[0_4px_32px_rgba(0,0,0,0.08)]">
          <div className="w-16 h-16 bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">Couldn&apos;t load listing</h2>
          <p className="text-[#9CA3AF] text-sm mb-6 leading-relaxed">{loadProductError}</p>
          <button
            onClick={() => router.push("/products")}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold transition-colors text-sm shadow-sm">
            Browse Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-8 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-3 mb-7">
            <div className="w-10 h-10 bg-emerald-900/40 rounded-2xl flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                {editId ? "Edit Listing" : "List an Item"}
              </h1>
              <p className="text-sm text-[#9CA3AF]">
                {editId ? "Update your listing details" : "Sell from your hostel room in minutes"}
              </p>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-3 bg-red-950/40 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Photos */}
            <div className="bg-[#151521] border border-white/[0.08] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <label className={labelCls}>
                <ImageIcon className="w-3.5 h-3.5" /> Photos{" "}
                <span className="font-normal normal-case tracking-normal text-[#6B7280]">(up to 5)</span>
              </label>
              <div className="flex gap-3 flex-wrap">
                {existingImages.map((img) => (
                  <div key={img.public_id || img.url} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/[0.08] shadow-sm">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img.public_id)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/70 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/[0.08] shadow-sm">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/70 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {totalImageCount < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-white/[0.08] flex flex-col items-center justify-center gap-1 text-[#6B7280] hover:border-[#FF6B00] hover:text-[#FFD4A0] transition-colors">
                    <Upload className="w-5 h-5" />
                    <span className="text-xs font-medium">Add</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <p className="text-[11px] text-[#6B7280] mt-2">
                JPG, PNG, WebP · Max 5 MB each
              </p>
            </div>

            {/* Title, Description, Category */}
            <div className="bg-[#151521] border border-white/[0.08] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
              <div>
                <label className={labelCls}><FileText className="w-3.5 h-3.5" /> Title *</label>
                <input
                  name="title" value={form.title} onChange={handleChange} required
                  maxLength={100}
                  placeholder="e.g. JBL Speaker, NCERT Physics, Nike T-Shirt…"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}><FileText className="w-3.5 h-3.5" /> Description (Optional)</label>
                <textarea
                  name="description" value={form.description} onChange={handleChange}
                  rows={3} maxLength={1000}
                  placeholder="Add more details about your item (optional)"
                  className={inputCls + " resize-none"}
                />
              </div>
              <div>
                <label className={labelCls}><Tag className="w-3.5 h-3.5" /> Category *</label>
                <select name="category" value={form.category} onChange={handleChange} required className={inputCls}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Price & Condition */}
            <div className="bg-[#151521] border border-white/[0.08] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}><IndianRupee className="w-3.5 h-3.5" /> Price (₹) *</label>
                  <input
                    name="price" value={form.price} onChange={handleChange}
                    required type="number" min="0" max="1000000"
                    placeholder="0"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Condition *</label>
                  <select name="condition" value={form.condition} onChange={handleChange} className={inputCls}>
                    {CONDITIONS.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group select-none">
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${form.negotiable ? "bg-[#FF6B00] border-[#FF6B00]" : "border-white/[0.08] bg-[#1E1E2E]"}`}>
                  {form.negotiable && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <input
                    type="checkbox" name="negotiable"
                    checked={form.negotiable} onChange={handleChange}
                    className="sr-only"
                  />
                </div>
                <span className="text-sm text-[#9CA3AF] font-medium group-hover:text-white transition-colors">
                  Price is negotiable
                </span>
              </label>
            </div>

            {/* Hostel */}
            <div className="bg-[#151521] border border-white/[0.08] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <label className={labelCls}><Home className="w-3.5 h-3.5" /> Your Hostel *</label>
              <select name="hostel" value={form.hostel} onChange={handleChange} required className={inputCls}>
                <option value="">Select your hostel</option>
                <optgroup label="QC Hostels (Girls)">
                  {QC_HOSTELS.map(h => <option key={h} value={h}>{h}</option>)}
                </optgroup>
                <optgroup label="KP Hostels (Girls)">
                  {KP_HOSTELS.map(h => <option key={h} value={h}>{h}</option>)}
                </optgroup>
              </select>
            </div>

            {/* Submit — primary CTA, HostelMart orange */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { y: -2 } : undefined}
              whileTap={!loading ? { scale: 0.98 } : undefined}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              className="group relative w-full grid grid-cols-[1fr_auto_1fr] items-center text-white font-bold text-[18px] rounded-[18px] px-7 disabled:opacity-50 disabled:cursor-not-allowed transition-[background,box-shadow] duration-200"
              style={{
                height: 58,
                background: "linear-gradient(135deg, #FF9B3D 0%, #FF7A18 100%)",
                boxShadow: "0 6px 24px rgba(255,122,24,0.35)",
              }}
              onMouseEnter={(e) => {
                if (loading) return;
                const el = e.currentTarget as HTMLElement;
                el.style.background = "linear-gradient(135deg, #FFAD5C 0%, #FF8B2E 100%)";
                el.style.boxShadow = "0 10px 32px rgba(255,122,24,0.50)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "linear-gradient(135deg, #FF9B3D 0%, #FF7A18 100%)";
                el.style.boxShadow = "0 6px 24px rgba(255,122,24,0.35)";
              }}
            >
              <span aria-hidden="true" />
              <span className="flex items-center justify-center gap-3 whitespace-nowrap">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Package className="w-5 h-5" />}
                {loading ? (editId ? "Saving…" : "Posting…") : (editId ? "Save Changes" : "Post Listing")}
              </span>
              {loading ? (
                <span aria-hidden="true" />
              ) : (
                <ArrowRight className="w-5 h-5 justify-self-end transition-transform duration-200 group-hover:translate-x-1" />
              )}
            </motion.button>

          </form>
        </div>
      </div>
  );
}

export default function SellPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SellForm />
    </Suspense>
  );
}
