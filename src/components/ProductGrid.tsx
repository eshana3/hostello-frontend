import ProductCard from "./ProductCard";
import type { Product } from "@/types";
import { PackageSearch } from "lucide-react";

interface Props {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
}

export default function ProductGrid({ products, isLoading, isError }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-64 bg-[#1E1E2E] rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#9CA3AF]">
        <PackageSearch className="w-12 h-12 mb-4" />
        <p className="font-semibold">Failed to load products</p>
        <p className="text-sm mt-1">Please try again later.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#9CA3AF]">
        <PackageSearch className="w-12 h-12 mb-4" />
        <p className="font-semibold">No products found</p>
        <p className="text-sm mt-1">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
