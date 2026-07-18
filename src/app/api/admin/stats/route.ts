import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

function getAuthHeader(req: NextRequest): Record<string, string> {
  const auth = req.headers.get("authorization");
  return auth ? { authorization: auth } : {};
}

async function safeFetch(url: string, headers: Record<string, string>): Promise<any> {
  try {
    const res = await fetch(url, { headers, cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const TYPE_MAP: Record<string, string> = {
  new_user: "user",
  product_sold: "sale",
  new_poll: "poll",
};

export async function GET(req: NextRequest) {
  const headers = getAuthHeader(req);

  const [statsData, hostelData, categoryData, chatData, activityData] = await Promise.all([
    safeFetch(`${BACKEND}/api/admin/stats`, headers),
    safeFetch(`${BACKEND}/api/admin/hostel-activity`, headers),
    safeFetch(`${BACKEND}/api/admin/category-sales`, headers),
    safeFetch(`${BACKEND}/api/admin/chat-activity`, headers),
    safeFetch(`${BACKEND}/api/admin/recent-activity`, headers),
  ]);

  if (!statsData) {
    return NextResponse.json({ message: "Failed to fetch admin stats" }, { status: 502 });
  }

  const base = statsData.stats ?? statsData;

  // Backend returns liveActiveUsers, dashboard uses liveUsers
  const liveUsers = base.liveActiveUsers ?? base.liveUsers ?? 0;

  // hostelActivity: backend {hostelName, totalProducts, soldProducts, activeProducts}
  //                dashboard XAxis="hostel", Bar="listings"
  const hostelActivity = (hostelData?.hostelActivity ?? []).map((h: any) => ({
    hostel: h.hostelName ?? "Unknown",
    listings: h.totalProducts ?? 0,
    sold: h.soldProducts ?? 0,
    active: h.activeProducts ?? 0,
  }));

  // categorySales → categoryBreakdown (same shape: { category, total, sold, active, avgPrice })
  const categoryBreakdown = categoryData?.categorySales ?? [];

  // chatActivity: backend {date, chats, totalMessages}, dashboard uses dataKey="messages"
  const chatActivity = (chatData?.chatActivity ?? []).map((c: any) => ({
    date: c.date,
    chats: c.chats ?? 0,
    messages: c.totalMessages ?? 0,
  }));

  // recentActivity: backend {type, description, timestamp, data}
  //                 dashboard needs {id, type, description, user, hostel, time}
  const recentActivity = (activityData?.activities ?? []).map((a: any, i: number) => {
    const d = a.data ?? {};
    const userName = d.name ?? d.mobile ?? d.seller?.name ?? "";
    const hostelName = d.hostel?.name ?? "";
    const time = a.timestamp
      ? new Date(a.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      : "";
    return {
      id: `${a.type}_${i}`,
      type: TYPE_MAP[a.type] ?? a.type,
      description: a.description ?? "",
      user: userName,
      hostel: hostelName,
      time,
    };
  });

  return NextResponse.json({
    ...base,
    liveUsers,
    hostelActivity,
    categoryBreakdown,
    chatActivity,
    recentActivity,
    // dailyUsers not available from backend — leave as empty array
    dailyUsers: base.dailyUsers ?? [],
    // topUsers not available from backend — admin/users page degrades gracefully
    topUsers: base.topUsers ?? [],
  });
}
