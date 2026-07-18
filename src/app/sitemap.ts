import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

async function fetchProductRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products?limit=50`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const products: Array<{ _id?: string; id?: string; updatedAt?: string }> = data.products ?? [];
    return products.map((p) => ({
      url: `${SITE_URL}/product/${p._id ?? p.id}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/polls`, changeFrequency: "hourly", priority: 0.8 },
  ];

  const productRoutes = await fetchProductRoutes();

  return [...staticRoutes, ...productRoutes];
}
