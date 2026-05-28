import { NextResponse } from "next/server";
import { MOCK_ADMIN_STATS } from "@/lib/mockAdmin";

export async function GET() {
  // Simulate live user count fluctuation
  const stats = {
    ...MOCK_ADMIN_STATS,
    liveUsers: Math.floor(Math.random() * 10) + 10,
  };
  return NextResponse.json(stats);
}
