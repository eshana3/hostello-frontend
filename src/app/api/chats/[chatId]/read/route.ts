import { NextResponse } from "next/server";

// The socket handler (mark_read event) is the authoritative path for marking messages read.
// This REST endpoint exists only as a fire-and-forget fallback in useChats.ts.
export async function POST() {
  return NextResponse.json({ success: true });
}
