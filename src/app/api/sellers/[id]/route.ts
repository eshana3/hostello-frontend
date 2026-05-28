import { NextRequest, NextResponse } from "next/server";
import { MOCK_PRODUCTS } from "@/lib/mockData";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const sellerId = params.id;
  const all = MOCK_PRODUCTS.filter(p => p.sellerId === sellerId);
  if (!all.length) return NextResponse.json({ error: "Seller not found" }, { status: 404 });

  const first = all[0];
  const active = all.filter(p => !p.sold);
  const sold = all.filter(p => p.sold);

  const seller = {
    id: sellerId,
    name: first.sellerName,
    hostelId: first.hostelId,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(first.sellerName)}&backgroundColor=7C3AED`,
    totalListings: all.length,
    activeListings: active.length,
    soldListings: sold.length,
    memberSince: "Jan 2024",
    responseRate: "92%",
  };

  return NextResponse.json({ seller, active, sold });
}
