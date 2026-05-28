import { NextRequest, NextResponse } from "next/server";
import { MOCK_POLLS } from "@/lib/mockPolls";
import type { Poll } from "@/types/poll";
import { CURRENT_USER_ID, CURRENT_USER_NAME } from "@/lib/mockChats";

const pollsStore: Poll[] = [...MOCK_POLLS];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hostel   = searchParams.get("hostel");
  const category = searchParams.get("category");
  const search   = searchParams.get("search")?.toLowerCase();
  const status   = searchParams.get("status") ?? "open";

  let results = pollsStore.filter(p => status === "all" ? true : p.status === status);
  if (hostel)   results = results.filter(p => p.hostelId === hostel);
  if (category) results = results.filter(p => p.category === category);
  if (search)   results = results.filter(p =>
    p.itemName.toLowerCase().includes(search) ||
    p.description.toLowerCase().includes(search)
  );

  return NextResponse.json(results.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newPoll: Poll = {
    id: `poll_${Date.now()}`,
    itemName: body.itemName,
    description: body.description,
    category: body.category,
    maxPrice: body.maxPrice ? Number(body.maxPrice) : undefined,
    hostelId: body.hostelId,
    buyerId: CURRENT_USER_ID,
    buyerName: CURRENT_USER_NAME,
    buyerAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(CURRENT_USER_NAME)}&backgroundColor=7C3AED`,
    status: "open",
    createdAt: new Date().toISOString(),
    replyCount: 0,
  };
  pollsStore.unshift(newPoll);
  return NextResponse.json(newPoll, { status: 201 });
}
