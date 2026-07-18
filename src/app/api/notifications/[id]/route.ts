import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

function getAuthHeader(req: NextRequest): Record<string, string> {
  const auth = req.headers.get("authorization");
  return auth ? { authorization: auth } : {};
}

// PATCH /api/notifications/:id — mark single notification as read
// Frontend sends PATCH /:id; backend expects PATCH /:id/read
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const upstream = await fetch(`${BACKEND}/api/notifications/${params.id}/read`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeader(req) },
  });

  const data = await upstream.json().catch(() => ({ success: true }));
  return NextResponse.json(data, { status: upstream.ok ? 200 : upstream.status });
}
