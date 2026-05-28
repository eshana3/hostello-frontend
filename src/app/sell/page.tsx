"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Upload, X, CheckCircle, Tag, IndianRupee, Home, FileText, Image as ImageIcon, Loader2, ArrowRight } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const CATEGORIES = [
  "Electronics",
  "Clothes",
  "Snacks",
  "Accessories",
  "Books",
  "Daily essentials",
];

const HOSTELS = [
  ...Array.from({ length: 25 }, (_, i) => `KP-${i + 1}`),
  ...Array.from({ length: 13 }, (_, i) => `QC-${i + 1}`),
];

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-[#1A1830] text-white placeholder-slate-300 focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#4C3699] transition-all text-sm shadow-sm";
const labelCls = "flex items-center gap-2 text-xs font-bold text-[#5E5B82] uppercase tracking-widest mb-2";

export default function SellPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "used",
    negotiable: false,
    hostel: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageAdd = () => {
    const idx = images.length + 1;
    setImages(prev => [...prev, `https://picsum.photos/400/400?random=${idx + 100}`]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#080912] flex items-center justify-center px-4">
          <div className="bg-[#13112A] border border-white/[0.08] rounded-3xl p-10 max-w-md w-full text-center shadow-[0_4px_32px_rgba(0,0,0,0.08)]">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">Listing Created!</h2>
            <p className="text-[#5E5B82] text-sm mb-6 leading-relaxed">
              Your item <span className="font-semibold text-white">"{form.title}"</span> is now live. Students in your hostel can find it.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setSubmitted(false); setForm({ title: "", description: "", price: "", category: "", condition: "used", negotiable: false, hostel: "" }); setImages([]); }}
                className="flex-1 border border-white/[0.08] text-[#9896B8] py-2.5 rounded-xl font-semibold hover:bg-[#131425] transition-colors text-sm">
                Sell Another
              </button>
              <button
                onClick={() => router.push("/products")}
                className="flex-1 bg-emerald-600 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-semibold transition-colors text-sm shadow-sm shadow-emerald-100">
                Browse Listings
              </button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#080912] py-8 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-3 mb-7">
            <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">List an Item</h1>
              <p className="text-sm text-[#5E5B82]">Sell from your hostel room in minutes</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Photos */}
            <div className="bg-[#13112A] border border-white/[0.08] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <label className={labelCls}>
                <ImageIcon className="w-3.5 h-3.5" /> Photos <span className="font-normal normal-case tracking-normal text-[#3D3B62]">(up to 5)</span>
              </label>
              <div className="flex gap-3 flex-wrap">
                {images.map((src, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/[0.08] shadow-sm">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImages(p => p.filter((_, j) => j !== i))}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <button type="button" onClick={handleImageAdd}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-white/[0.08] flex flex-col items-center justify-center gap-1 text-[#3D3B62] hover:border-[#7C3AED] hover:text-[#C4B5FD] transition-colors">
                    <Upload className="w-5 h-5" />
                    <span className="text-xs font-medium">Add</span>
                  </button>
                )}
              </div>
            </div>

            {/* Title, Description, Category */}
            <div className="bg-[#13112A] border border-white/[0.08] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
              <div>
                <label className={labelCls}><FileText className="w-3.5 h-3.5" /> Title</label>
                <input
                  name="title" value={form.title} onChange={handleChange} required
                  placeholder="e.g. JBL Speaker, NCERT Physics, Nike T-Shirt…"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}><FileText className="w-3.5 h-3.5" /> Description</label>
                <textarea
                  name="description" value={form.description} onChange={handleChange} required rows={3}
                  placeholder="Describe the condition, what's included, why you're selling…"
                  className={inputCls + " resize-none"}
                />
              </div>
              <div>
                <label className={labelCls}><Tag className="w-3.5 h-3.5" /> Category</label>
                <select name="category" value={form.category} onChange={handleChange} required className={inputCls}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Price & Condition */}
            <div className="bg-[#13112A] border border-white/[0.08] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}><IndianRupee className="w-3.5 h-3.5" /> Price (₹)</label>
                  <input
                    name="price" value={form.price} onChange={handleChange} required type="number" min="0"
                    placeholder="0"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Condition</label>
                  <select name="condition" value={form.condition} onChange={handleChange} className={inputCls}>
                    <option value="used">Used</option>
                    <option value="new">New / Unopened</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${form.negotiable ? "bg-[#7C3AED] border-[#7C3AED]" : "border-white/[0.08] bg-[#1A1830]"}`}>
                  {form.negotiable && <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  <input type="checkbox" name="negotiable" checked={form.negotiable} onChange={handleChange} className="sr-only" />
                </div>
                <span className="text-sm text-[#9896B8] font-medium group-hover:text-white transition-colors">Price is negotiable</span>
              </label>
            </div>

            {/* Hostel */}
            <div className="bg-[#13112A] border border-white/[0.08] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <label className={labelCls}><Home className="w-3.5 h-3.5" /> Your Hostel</label>
              <select name="hostel" value={form.hostel} onChange={handleChange} required className={inputCls}>
                <option value="">Select your hostel</option>
                {HOSTELS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-sm shadow-emerald-100 transition-all flex items-center justify-center gap-2 text-[15px]">
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Posting…</>
                : <><Package className="w-5 h-5" /> Post Listing <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
