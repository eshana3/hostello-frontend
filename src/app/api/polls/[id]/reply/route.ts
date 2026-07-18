import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

function getAuthHeader(req: NextRequest): Record<string, string> {
  const auth = req.headers.get("authorization");
  return auth ? { authorization: auth } : {};
}

function avatarUrl(name: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=7C3AED`;
}

// POST /api/polls/:id/reply — add a reply to a poll
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => ({}));

  const upstream = await fetch(`${BACKEND}/api/polls/${params.id}/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader(req) },
    body: JSON.stringify({ message: body.message }),
  });

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}));
    return NextResponse.json(err, { status: upstream.status });
  }

  const data = await upstream.json();
  const reply = data.reply ?? {};
  const sellerId = typeof reply.seller === "object" ? (reply.seller?._id?.toString() ?? "") : (reply.seller?.toString() ?? "");
  const sellerName = typeof reply.seller === "object" ? (reply.seller?.name ?? "Unknown") : "Unknown";

  return NextResponse.json({
    id: reply._id?.toString() ?? "",
    pollId: params.id,
    sellerId,
    sellerName,
    sellerAvatar: avatarUrl(sellerName),
    message: reply.message ?? body.message ?? "",
    price: body.price ?? undefined,
    createdAt: reply.createdAt ?? new Date().toISOString(),
  }, { status: 201 });
}
