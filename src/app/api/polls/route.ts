import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

function getAuthHeader(req: NextRequest): Record<string, string> {
  const auth = req.headers.get("authorization");
  return auth ? { authorization: auth } : {};
}

function avatarUrl(name: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=7C3AED`;
}

export function transformPoll(p: any): any {
  const hostelName = typeof p.hostel === "object" ? (p.hostel?.name ?? "") : (p.hostel ?? "");
  const buyerId = typeof p.buyer === "object" ? (p.buyer?._id?.toString() ?? "") : (p.buyer?.toString() ?? "");
  const buyerName = typeof p.buyer === "object" ? (p.buyer?.name ?? "Unknown") : "Unknown";

  return {
    id: p._id?.toString() ?? "",
    itemName: p.itemName ?? "",
    description: p.description ?? "",
    category: p.category ?? "",
    maxPrice: p.maxPrice ?? undefined,
    hostelId: hostelName,
    buyerId,
    buyerName,
    buyerAvatar: avatarUrl(buyerName),
    status: p.status ?? "open",
    createdAt: p.createdAt ?? new Date().toISOString(),
    replyCount: Array.isArray(p.replies) ? p.replies.length : (p.replyCount ?? 0),
  };
}

// GET /api/polls — list polls with optional filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const qs = searchParams.toString();

  const upstream = await fetch(`${BACKEND}/api/polls${qs ? "?" + qs : ""}`, {
    headers: { ...getAuthHeader(req) },
    cache: "no-store",
  });

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}));
    return NextResponse.json(err, { status: upstream.status });
  }

  const data = await upstream.json();
  // Backend returns { polls, total, page, pages } — frontend expects Poll[]
  return NextResponse.json((data.polls ?? []).map(transformPoll));
}

// POST /api/polls — create a new poll request
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  const upstream = await fetch(`${BACKEND}/api/polls`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader(req) },
    body: JSON.stringify(body),
  });

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}));
    return NextResponse.json(err, { status: upstream.status });
  }

  const data = await upstream.json();
  return NextResponse.json(transformPoll(data.poll ?? {}), { status: 201 });
}
