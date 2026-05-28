"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, TrendingUp } from "lucide-react";

export default function HeroBanner() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/products?search=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1E1A6E 0%, #3730A3 35%, #4F46E5 60%, #7C3AED 100%)" }}>

      {/* Subtle dot grid overlay */}
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* Glow orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-violet-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-indigo-300/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative section py-16 sm:py-20">
        <div className="max-w-2xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 animate-fade-in backdrop-blur-sm">
            <TrendingUp className="w-3.5 h-3.5" />
            Campus Marketplace
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.1] mb-4 animate-fade-up">
            Buy &amp; Sell<br />
            <span className="text-white/70">Within Your Hostel.</span>
          </h1>

          <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-8 max-w-xl animate-fade-up">
            Find textbooks, electronics, clothes &amp; more — listed by students in your own block.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-3 mb-10 animate-fade-up max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border border-white/20 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-[#1A1830]/15 transition-all backdrop-blur-sm"
              />
            </div>
            <button type="submit"
              className="bg-white hover:bg-[#1A1830]/90 text-[#4338CA] font-bold px-5 py-3 rounded-xl transition-all text-sm shadow-lg">
              Search
            </button>
          </form>

          {/* Stats */}
          <div className="flex items-center gap-8 animate-fade-up">
            {[["200+", "Active Listings"], ["38", "Hostels"], ["8", "Categories"]].map(([val, label]) => (
              <div key={label}>
                <p className="text-xl font-black text-white">{val}</p>
                <p className="text-xs text-white/50 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
