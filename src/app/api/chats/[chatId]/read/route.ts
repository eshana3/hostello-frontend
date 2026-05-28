import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  // TODO: update unread count in DB
  return NextResponse.json({ success: true, chatId: params.chatId });
}
