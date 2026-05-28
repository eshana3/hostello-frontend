"use client";
import { Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ProductFilters } from "@/types";

function HostelContent() {
  const params = useParams();
  const hostelId = Array.isArray(params.id) ? params.id[0] : params.id ?? "";
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters: ProductFilters = {
    hostel: hostelId,
    page:   Number(searchParams.get("page") ?? 1),
    limit:  12,
  };

  const { data, isLoading, isError } = useProducts(filters);

  function goPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`/hostel/${hostelId}?${params.toString()}`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link href="/products" className="inline-flex items-center gap-1 text-sm text-[#A78BFA] hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to all products
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8 p-4 bg-[#1A1830] rounded-xl shadow-sm border border-[#252248]">
        <div className="w-12 h-12 rounded-full bg-[#3D2785] flex items-center justify-center">
          <MapPin className="w-6 h-6 text-[#A78BFA]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#F0EEFF]">{hostelId}</h1>
          <p className="text-sm text-[#9896B8]">
            {data ? `${data.total} active listing${data.total !== 1 ? "s" : ""}` : "Loading…"}
          </p>
        </div>
      </div>

      <ProductGrid products={data?.products ?? []} isLoading={isLoading} isError={isError} />

      {data && (
        <Pagination currentPage={data.page} totalPages={data.totalPages} onPageChange={goPage} />
      )}
    </div>
  );
}

export default function HostelPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-40 text-[#5E5B82]">Loading...</div>}>
      <HostelContent />
    </Suspense>
  );
}
