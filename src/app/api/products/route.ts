import { NextRequest, NextResponse } from "next/server";
import { MOCK_PRODUCTS } from "@/lib/mockData";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const category  = searchParams.get("category")  ?? undefined;
  const hostel    = searchParams.get("hostel")    ?? undefined;
  const condition = searchParams.get("condition") ?? undefined;
  const search    = searchParams.get("search")    ?? undefined;
  const minPrice  = searchParams.get("minPrice")  ? Number(searchParams.get("minPrice"))  : undefined;
  const maxPrice  = searchParams.get("maxPrice")  ? Number(searchParams.get("maxPrice"))  : undefined;
  const sold      = searchParams.get("sold") === "true" ? true : searchParams.get("sold") === "false" ? false : undefined;
  const page      = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit     = Math.min(50, Number(searchParams.get("limit") ?? 12));

  let filtered = MOCK_PRODUCTS.filter((p) => {
    if (sold !== undefined && p.sold !== sold) return false;
    if (sold === undefined && p.sold) return false;   // default: hide sold
    if (category  && p.category  !== category)  return false;
    if (hostel    && p.hostel    !== hostel)    return false;
    if (condition && p.condition !== condition) return false;
    if (minPrice  && p.price < minPrice) return false;
    if (maxPrice  && p.price > maxPrice) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const total      = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start      = (page - 1) * limit;
  const products   = filtered.slice(start, start + limit);

  return NextResponse.json({ products, total, page, totalPages, limit });
}
