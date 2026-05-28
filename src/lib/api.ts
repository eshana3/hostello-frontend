import type { Product, ProductFilters, ProductsResponse, HostelGroup } from "@/types";

const BASE = "";

export async function fetchProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.hostel) params.set("hostel", filters.hostel);
  if (filters.condition) params.set("condition", filters.condition);
  if (filters.search) params.set("search", filters.search);
  if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
  if (filters.page !== undefined) params.set("page", String(filters.page));
  if (filters.limit !== undefined) params.set("limit", String(filters.limit));
  const qs = params.toString();
  const res = await fetch(`${BASE}/api/products${qs ? "?" + qs : ""}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchTrendingProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/api/products/trending`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch trending");
  return res.json();
}

export async function fetchHostels(): Promise<HostelGroup[]> {
  const res = await fetch(`${BASE}/api/hostels`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch hostels");
  return res.json();
}

export async function fetchProductById(id: string): Promise<{ product: Product; related: Product[] }> {
  const res = await fetch(`${BASE}/api/products/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function fetchSellerById(id: string): Promise<{
  seller: {
    id: string; name: string; hostelId: string; avatar: string;
    totalListings: number; activeListings: number; soldListings: number;
    memberSince: string; responseRate: string;
  };
  active: Product[];
  sold: Product[];
}> {
  const res = await fetch(`${BASE}/api/sellers/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch seller");
  return res.json();
}
