import { NextResponse } from "next/server";
import { MOCK_PRODUCTS } from "@/lib/mockData";

export async function GET() {
  const trending = [...MOCK_PRODUCTS]
    .filter((p) => !p.sold)
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);
  return NextResponse.json(trending);
}
