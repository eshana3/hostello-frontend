import { NextRequest, NextResponse } from "next/server";
import { MOCK_NOTIFICATIONS } from "@/lib/mockNotifications";
import type { Notification } from "@/types/notification";

let store: Notification[] = [...MOCK_NOTIFICATIONS];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page  = Number(searchParams.get("page")  ?? 1);
  const limit = Number(searchParams.get("limit") ?? 20);
  const sorted = [...store].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const paginated = sorted.slice((page - 1) * limit, page * limit);
  const unreadCount = store.filter(n => !n.read).length;
  return NextResponse.json({ notifications: paginated, unreadCount, total: store.length });
}

export async function PATCH() {
  // Mark ALL as read
  store = store.map(n => ({ ...n, read: true }));
  return NextResponse.json({ success: true });
}

// Internal helper used by socket events to push a notification
export function pushNotification(n: Notification) {
  store.unshift(n);
}
