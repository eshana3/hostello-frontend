import { NextRequest, NextResponse } from "next/server";
import { MOCK_PRODUCTS } from "@/lib/mockData";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = MOCK_PRODUCTS.find(p => p.id === params.id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const related = MOCK_PRODUCTS.filter(
    p => p.id !== product.id && !p.sold &&
      (p.category === product.category || p.hostelId === product.hostelId)
  ).slice(0, 4);

  return NextResponse.json({ product, related });
}
