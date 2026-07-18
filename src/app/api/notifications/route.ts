import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

function getAuthHeader(req: NextRequest): Record<string, string> {
  const auth = req.headers.get("authorization");
  return auth ? { authorization: auth } : {};
}

const TYPE_MAP: Record<string, string> = {
  new_message: "message",
  product_sold: "sold",
  interested_buyer: "sold",
  poll_reply: "poll_reply",
  product_removed: "listing",
  general: "system",
};

const TITLE_MAP: Record<string, string> = {
  new_message: "New Message",
  product_sold: "Product Sold",
  interested_buyer: "Interested Buyer",
  poll_reply: "Poll Reply",
  product_removed: "Listing Removed",
  general: "Notification",
};

export function transformNotification(n: any): any {
  return {
    id: n._id?.toString() ?? "",
    type: TYPE_MAP[n.type] ?? "system",
    title: TITLE_MAP[n.type] ?? "Notification",
    message: n.message ?? "",
    read: n.isRead ?? false,
    createdAt: n.createdAt ?? new Date().toISOString(),
    link: n.reference ?? undefined,
  };
}

// GET /api/notifications
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const qs = searchParams.toString();

  const upstream = await fetch(`${BACKEND}/api/notifications${qs ? "?" + qs : ""}`, {
    headers: { ...getAuthHeader(req) },
    cache: "no-store",
  });

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}));
    return NextResponse.json(err, { status: upstream.status });
  }

  const data = await upstream.json();
  return NextResponse.json({
    notifications: (data.notifications ?? []).map(transformNotification),
    unreadCount: data.unreadCount ?? 0,
    total: data.total ?? 0,
  });
}

// PATCH /api/notifications — mark ALL as read
// Frontend sends PATCH here; backend expects POST /notifications/mark-all-read
export async function PATCH(req: NextRequest) {
  const upstream = await fetch(`${BACKEND}/api/notifications/mark-all-read`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader(req) },
  });

  const data = await upstream.json().catch(() => ({ success: true }));
  return NextResponse.json(data, { status: upstream.ok ? 200 : upstream.status });
}
