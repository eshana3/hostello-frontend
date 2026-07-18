import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

function getAuthHeader(req: NextRequest): Record<string, string> {
  const auth = req.headers.get("authorization");
  return auth ? { authorization: auth } : {};
}

function avatarUrl(name: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=7C3AED`;
}

function transformChat(chat: any): any {
  const other = chat.otherParticipant ?? {};
  const otherId = other._id?.toString() ?? "";
  const otherName = other.name ?? "Unknown";

  const lastMsg = chat.lastMessage;
  const prod = chat.product;
  const prodImages = prod?.images ?? [];
  const prodImageUrl = typeof prodImages[0] === "string"
    ? prodImages[0]
    : (prodImages[0]?.url ?? "");

  return {
    id: chat._id?.toString() ?? "",
    participants: [otherId],
    participantNames: { [otherId]: otherName },
    participantAvatars: { [otherId]: avatarUrl(otherName) },
    lastMessage: lastMsg?.text ?? undefined,
    lastMessageTime: lastMsg?.timestamp ?? chat.updatedAt,
    lastMessageSenderId: lastMsg?.sender?.toString() ?? undefined,
    unreadCount: chat.unreadCount ?? 0,
    productId: prod?._id?.toString() ?? undefined,
    productTitle: prod?.title ?? undefined,
    productImageUrl: prodImageUrl || undefined,
  };
}

// GET /api/chats — list chats for current user
export async function GET(req: NextRequest) {
  const upstream = await fetch(`${BACKEND}/api/chats`, {
    headers: { ...getAuthHeader(req) },
    cache: "no-store",
  });

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}));
    return NextResponse.json(err, { status: upstream.status });
  }

  const data = await upstream.json();
  const chats: any[] = data.chats ?? [];
  return NextResponse.json(chats.map(transformChat));
}

// POST /api/chats — create or get existing chat
// Body: { recipientId, productId? } OR legacy { sellerId, productId, ... }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  // Normalise: legacy frontend sends "sellerId", backend expects "recipientId"
  const upstream = await fetch(`${BACKEND}/api/chats`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader(req) },
    body: JSON.stringify({
      recipientId: body.recipientId ?? body.sellerId,
      productId: body.productId,
    }),
  });

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}));
    return NextResponse.json(err, { status: upstream.status });
  }

  const data = await upstream.json();
  const chat = data.chat;
  const chatId = chat?._id?.toString() ?? chat?.id ?? "";

  return NextResponse.json(
    { ...transformChat(chat ?? {}), id: chatId, _id: chatId },
    { status: upstream.status === 201 ? 201 : 200 }
  );
}
