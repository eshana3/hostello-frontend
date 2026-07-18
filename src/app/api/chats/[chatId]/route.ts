import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

function getAuthHeader(req: NextRequest): Record<string, string> {
  const auth = req.headers.get("authorization");
  return auth ? { authorization: auth } : {};
}

function transformMessage(msg: any, chatId: string, participants: any[]): any {
  const senderId = msg.sender?.toString() ?? "";
  const senderUser = participants.find((p: any) => p._id?.toString() === senderId);
  return {
    id: msg._id?.toString() ?? `msg_${Date.now()}`,
    chatId,
    senderId,
    senderName: senderUser?.name ?? "Unknown",
    content: msg.text ?? "",
    createdAt: msg.timestamp ?? new Date().toISOString(),
    read: msg.read ?? false,
  };
}

// GET /api/chats/:chatId — fetch messages
// Proxies to GET /api/chats/:chatId/messages on backend
export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  const { chatId } = params;
  const upstream = await fetch(`${BACKEND}/api/chats/${chatId}/messages`, {
    headers: { ...getAuthHeader(req) },
    cache: "no-store",
  });

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}));
    return NextResponse.json(err, { status: upstream.status });
  }

  const data = await upstream.json();
  const messages: any[] = data.messages ?? [];
  const participants: any[] = data.participants ?? [];

  return NextResponse.json(messages.map(msg => transformMessage(msg, chatId, participants)));
}

// POST /api/chats/:chatId — send a message (REST fallback when socket unavailable)
// Body: { content, senderId? }
export async function POST(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  const { chatId } = params;
  const body = await req.json().catch(() => ({}));

  const upstream = await fetch(`${BACKEND}/api/chats/${chatId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader(req) },
    body: JSON.stringify({ text: body.content ?? body.text ?? "" }),
  });

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}));
    return NextResponse.json(err, { status: upstream.status });
  }

  const data = await upstream.json();
  const msg = data.message ?? {};

  return NextResponse.json({
    id: msg._id?.toString() ?? `msg_${Date.now()}`,
    chatId,
    senderId: msg.sender?.toString() ?? "",
    senderName: "You",
    content: msg.text ?? body.content ?? "",
    createdAt: msg.timestamp ?? new Date().toISOString(),
    read: false,
  }, { status: 201 });
}
