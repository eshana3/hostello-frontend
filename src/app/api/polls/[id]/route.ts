import { NextRequest, NextResponse } from "next/server";
import { transformPoll } from "@/app/api/polls/route";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

function getAuthHeader(req: NextRequest): Record<string, string> {
  const auth = req.headers.get("authorization");
  return auth ? { authorization: auth } : {};
}

function avatarUrl(name: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=7C3AED`;
}

function transformReply(r: any, pollId: string): any {
  const sellerId = typeof r.seller === "object" ? (r.seller?._id?.toString() ?? "") : (r.seller?.toString() ?? "");
  const sellerName = typeof r.seller === "object" ? (r.seller?.name ?? "Unknown") : "Unknown";
  return {
    id: r._id?.toString() ?? "",
    pollId,
    sellerId,
    sellerName,
    sellerAvatar: avatarUrl(sellerName),
    message: r.message ?? "",
    price: r.price ?? undefined,
    createdAt: r.createdAt ?? new Date().toISOString(),
  };
}

// GET /api/polls/:id — get poll detail with replies
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const upstream = await fetch(`${BACKEND}/api/polls/${params.id}`, {
    headers: { ...getAuthHeader(req) },
    cache: "no-store",
  });

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}));
    return NextResponse.json(err, { status: upstream.status });
  }

  const data = await upstream.json();
  const poll = data.poll ?? {};
  const replies: any[] = Array.isArray(poll.replies) ? poll.replies : [];

  return NextResponse.json({
    poll: transformPoll(poll),
    replies: replies.map(r => transformReply(r, params.id)),
  });
}

// PATCH /api/polls/:id — close a poll, or edit its fields
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const rawBody = await req.text();
  const body = JSON.parse(rawBody || "{}");

  const upstreamUrl = body.status === "closed"
    ? `${BACKEND}/api/polls/${params.id}/close`
    : `${BACKEND}/api/polls/${params.id}`;

  const upstream = await fetch(upstreamUrl, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeader(req) },
    body: body.status === "closed" ? undefined : rawBody,
  });

  const responseData = await upstream.json().catch(() => ({}));
  return NextResponse.json(responseData, { status: upstream.status });
}

// DELETE /api/polls/:id — delete a request
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const upstream = await fetch(`${BACKEND}/api/polls/${params.id}`, {
    method: "DELETE",
    headers: { ...getAuthHeader(req) },
  });

  const responseData = await upstream.json().catch(() => ({}));
  return NextResponse.json(responseData, { status: upstream.status });
}
