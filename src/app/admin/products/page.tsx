"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Package, CheckCircle, XCircle } from "lucide-react";
import clsx from "clsx";
import { authFetch } from "@/lib/api";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const res = await authFetch("/api/products?limit=50");
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
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="pl-9 pr-4 py-2 rounded-xl border border-white/[0.08] bg-[#1E1E2E] text-sm text-[#C9D1D9] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 transition-all w-full" />
        </div>
      </div>

      <div className="bg-[#151521] border border-white/[0.08] rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#151521]">
                <th className="text-left px-4 py-3 font-semibold text-[#9CA3AF]">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-[#9CA3AF]">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-[#9CA3AF]">Hostel</th>
                <th className="text-left px-4 py-3 font-semibold text-[#9CA3AF]">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-[#9CA3AF]">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-[#9CA3AF]">Seller</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.08]">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-[#1E1E2E] rounded animate-pulse" /></td></tr>
                ))
              ) : products.map((p: { id: string; imageUrl: string; title: string; category: string; hostelId: string; price: number; sold: boolean; sellerName: string }) => (
                <tr key={p.id} className="hover:bg-[#151521] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl} alt={p.title} className="w-8 h-8 rounded-lg object-cover bg-[#1E1E2E] flex-shrink-0" />
                      <span className="font-medium text-[#D4D1F0] line-clamp-1">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#9CA3AF]">{p.category}</td>
                  <td className="px-4 py-3 text-[#9CA3AF]">{p.hostelId}</td>
                  <td className="px-4 py-3 font-semibold text-[#FF8C00]">₹{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={clsx("flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full w-fit",
                      p.sold ? "bg-[#1E1E2E] text-[#9CA3AF]" : "bg-emerald-900/40 text-emerald-400")}>
                      {p.sold ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                      {p.sold ? "Sold" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#9CA3AF]">{p.sellerName}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && products.length === 0 && (
            <div className="flex flex-col items-center py-12 gap-3 text-[#9CA3AF]">
              <Package className="w-8 h-8" />
              <p className="text-sm">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
