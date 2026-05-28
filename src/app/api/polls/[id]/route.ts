import { NextRequest, NextResponse } from "next/server";
import { MOCK_POLLS, MOCK_POLL_REPLIES } from "@/lib/mockPolls";
import type { Poll, PollReply } from "@/types/poll";

const pollsStore: Poll[] = [...MOCK_POLLS];
const repliesStore: Record<string, PollReply[]> = { ...MOCK_POLL_REPLIES };

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const poll = pollsStore.find(p => p.id === params.id);
  if (!poll) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ poll, replies: repliesStore[params.id] ?? [] });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const poll = pollsStore.find(p => p.id === params.id);
  if (!poll) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json();
  if (body.status) poll.status = body.status;
  return NextResponse.json(poll);
}
