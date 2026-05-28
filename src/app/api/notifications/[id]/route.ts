import { NextRequest, NextResponse } from "next/server";
import { MOCK_NOTIFICATIONS } from "@/lib/mockNotifications";
import type { Notification } from "@/types/notification";

let store: Notification[] = [...MOCK_NOTIFICATIONS];

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  store = store.map(n => n.id === params.id ? { ...n, read: true } : n);
  return NextResponse.json({ success: true });
}
