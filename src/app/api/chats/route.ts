import { NextRequest, NextResponse } from "next/server";
import { MOCK_CHATS, CURRENT_USER_ID } from "@/lib/mockChats";

// In-memory store — replace with DB when backend is ready
let chats = [...MOCK_CHATS];

export async function GET() {
  const userChats = chats.filter(c => c.participants.includes(CURRENT_USER_ID));
  const sorted = [...userChats].sort((a, b) =>
    new Date(b.lastMessageTime ?? 0).getTime() - new Date(a.lastMessageTime ?? 0).getTime()
  );
  return NextResponse.json(sorted);
}

export async function POST(req: NextRequest) {
  const { productId, sellerId, sellerName, productTitle, productImageUrl } = await req.json();

  // Return existing chat if one exists
  const existing = chats.find(c =>
    c.participants.includes(CURRENT_USER_ID) &&
    c.participants.includes(sellerId) &&
    c.productId === productId
  );
  if (existing) return NextResponse.json(existing);

  const newChat = {
    id: `chat_${Date.now()}`,
    participants: [CURRENT_USER_ID, sellerId],
    participantNames: { [CURRENT_USER_ID]: "You", [sellerId]: sellerName },
    participantAvatars: {
      [CURRENT_USER_ID]: `https://api.dicebear.com/7.x/initials/svg?seed=You&backgroundColor=7C3AED`,
      [sellerId]: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(sellerName)}&backgroundColor=7C3AED`,
    },
    lastMessage: undefined,
    lastMessageTime: new Date().toISOString(),
    lastMessageSenderId: undefined,
    unreadCount: 0,
    productId,
    productTitle,
    productImageUrl,
  };

  chats.push(newChat);
  return NextResponse.json(newChat, { status: 201 });
}
