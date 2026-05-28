import { NextRequest, NextResponse } from "next/server";
import { MOCK_POLLS, MOCK_POLL_REPLIES } from "@/lib/mockPolls";
import type { Poll, PollReply } from "@/types/poll";
import { CURRENT_USER_ID, CURRENT_USER_NAME } from "@/lib/mockChats";

const pollsStore: Poll[] = [...MOCK_POLLS];
const repliesStore: Record<string, PollReply[]> = { ...MOCK_POLL_REPLIES };

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const poll = pollsStore.find(p => p.id === params.id);
  if (!poll) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (poll.status === "closed") return NextResponse.json({ error: "Poll is closed" }, { status: 400 });

  const body = await req.json();
  const reply: PollReply = {
    id: `reply_${Date.now()}`,
    pollId: params.id,
    sellerId: CURRENT_USER_ID,
    sellerName: CURRENT_USER_NAME,
    sellerAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(CURRENT_USER_NAME)}&backgroundColor=7C3AED`,
    message: body.message,
    price: body.price ? Number(body.price) : undefined,
    createdAt: new Date().toISOString(),
  };

  if (!repliesStore[params.id]) repliesStore[params.id] = [];
  repliesStore[params.id].push(reply);
  poll.replyCount = (poll.replyCount ?? 0) + 1;

  return NextResponse.json(reply, { status: 201 });
}
