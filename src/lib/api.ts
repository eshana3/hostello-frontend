import type { Product, ProductFilters, ProductsResponse, HostelGroup } from "@/types";
import { getAuthToken } from "@/providers/AuthProvider";

function normalizeProduct(p: any): Product {
  const hostel = typeof p.hostel === "object" && p.hostel !== null ? p.hostel.name : p.hostel;
  const images = (p.images ?? []).map((img: any) => (typeof img === "string" ? img : img?.url ?? ""));
  return {
    ...p,
    id: p._id?.toString() ?? p.id,
    hostel,
    images,
    sold: p.sold ?? p.status === "sold",
    condition: p.condition ?? "used",
    seller: p.seller
      ? { id: p.seller._id?.toString() ?? p.seller.id, name: p.seller.name, hostel: typeof p.seller.hostel === "object" ? p.seller.hostel?.name : p.seller.hostel, avatar: p.seller.avatar }
      : p.seller,
  };
}

const BASE = "";

// ── Auth helpers ──────────────────────────────────────────────────────────────

/** Authenticated fetch — attaches Bearer token automatically */
export async function authFetch(path: string, init: RequestInit = {}) {
  const token = getAuthToken();
  return fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers as Record<string, string> | undefined),
    },
  });
}

export async function registerUser(name: string, email: string, password: string) {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function googleSignIn(idToken: string) {
  const res = await fetch(`${BASE}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  return res.json();
}

export async function getMe() {
  const res = await authFetch("/api/auth/me");
  return res.json();
}

export async function logoutUser() {
  const res = await authFetch("/api/auth/logout", { method: "POST" });
  return res.json();
}

export async function updateProfile(name: string, hostel: string) {
  const res = await authFetch("/api/auth/update-profile", {
    method: "PUT",
    body: JSON.stringify({ name, hostel }),
  });
  return res.json();
}

// ─────────────────────────────────────────────────────────────────────────────

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
  const data = await res.json();
  return {
    products: (data.products ?? []).map(normalizeProduct),
    total: data.total ?? 0,
    page: data.page ?? 1,
    totalPages: data.pages ?? data.totalPages ?? 1,
    limit: data.limit ?? 20,
  };
}

export async function fetchTrendingProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/api/products/trending`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch trending");
  const data = await res.json();
  const arr: any[] = data.products ?? data;
  return arr.map(normalizeProduct);
}

export async function fetchHostels(): Promise<HostelGroup[]> {
  const res = await fetch(`${BASE}/api/hostels`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch hostels");
  return res.json();
}

export async function fetchProductById(id: string): Promise<{ product: Product; related: Product[] }> {
  const res = await fetch(`${BASE}/api/products/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch product");
  const data = await res.json();
  return {
    product: normalizeProduct(data.product ?? data),
    related: (data.related ?? []).map(normalizeProduct),
  };
}

export interface Purchase {
  id: string;
  title: string;
  image: string | null;
  price: number;
  sellerName: string;
  orderDate: string;
  status: string;
}

export async function fetchMyPurchases(): Promise<Purchase[]> {
  const res = await authFetch("/api/purchases");
  if (!res.ok) throw new Error("Failed to fetch purchase history");
  const data = await res.json();
  return data.purchases ?? [];
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
  const data = await res.json();
  return {
    seller: data.seller,
    active: (data.active ?? []).map(normalizeProduct),
    sold: (data.sold ?? []).map(normalizeProduct),
  };
}
