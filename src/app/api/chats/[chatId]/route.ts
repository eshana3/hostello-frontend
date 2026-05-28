import { NextRequest, NextResponse } from "next/server";
import { MOCK_MESSAGES, CURRENT_USER_ID, CURRENT_USER_NAME } from "@/lib/mockChats";
import type { Message } from "@/types/chat";

// In-memory messages store
const messagesStore: Record<string, Message[]> = { ...MOCK_MESSAGES };

export async function GET(
  _req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  return NextResponse.json(messagesStore[params.chatId] ?? []);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  const { content, senderId } = await req.json();
  const newMessage: Message = {
    id: `msg_${Date.now()}`,
    chatId: params.chatId,
    senderId: senderId ?? CURRENT_USER_ID,
    senderName: senderId === CURRENT_USER_ID ? CURRENT_USER_NAME : "Unknown",
    content,
    createdAt: new Date().toISOString(),
    read: false,
  };

  if (!messagesStore[params.chatId]) messagesStore[params.chatId] = [];
  messagesStore[params.chatId].push(newMessage);

  return NextResponse.json(newMessage, { status: 201 });
}
