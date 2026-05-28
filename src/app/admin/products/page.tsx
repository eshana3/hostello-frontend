"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Package, CheckCircle, XCircle } from "lucide-react";
import clsx from "clsx";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const res = await fetch("/api/products?limit=50&sold=all");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const products = (data?.products ?? []).filter((p: { title: string }) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Products</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5E5B82]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="pl-9 pr-4 py-2 rounded-xl border border-white/[0.08] bg-[#1A1830] text-sm text-[#B5B2D8] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 transition-all w-56" />
        </div>
      </div>

      <div className="bg-[#13112A] border border-white/[0.08] rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#131425]">
                <th className="text-left px-4 py-3 font-semibold text-[#9896B8]">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-[#9896B8]">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-[#9896B8]">Hostel</th>
                <th className="text-left px-4 py-3 font-semibold text-[#9896B8]">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-[#9896B8]">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-[#9896B8]">Seller</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.08]">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-[#1A1830] rounded animate-pulse" /></td></tr>
                ))
              ) : products.map((p: { id: string; imageUrl: string; title: string; category: string; hostelId: string; price: number; sold: boolean; sellerName: string }) => (
                <tr key={p.id} className="hover:bg-[#131425] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl} alt={p.title} className="w-8 h-8 rounded-lg object-cover bg-[#1A1830] flex-shrink-0" />
                      <span className="font-medium text-[#D4D1F0] line-clamp-1">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#7B78A0]">{p.category}</td>
                  <td className="px-4 py-3 text-[#7B78A0]">{p.hostelId}</td>
                  <td className="px-4 py-3 font-semibold text-[#A78BFA]">₹{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={clsx("flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full w-fit",
                      p.sold ? "bg-[#1A1830] text-[#7B78A0]" : "bg-emerald-900/40 text-emerald-400")}>
                      {p.sold ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                      {p.sold ? "Sold" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#7B78A0]">{p.sellerName}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && products.length === 0 && (
            <div className="flex flex-col items-center py-12 gap-3 text-[#5E5B82]">
              <Package className="w-8 h-8" />
              <p className="text-sm">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
