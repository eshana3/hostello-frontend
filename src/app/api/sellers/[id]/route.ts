import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

function getAuthHeader(req: NextRequest): Record<string, string> {
  const auth = req.headers.get("authorization");
  return auth ? { authorization: auth } : {};
}

// GET /api/sellers/:id — proxy to real backend seller endpoint
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const upstream = await fetch(`${BACKEND}/api/sellers/${params.id}`, {
    headers: { ...getAuthHeader(req) },
    cache: "no-store",
  });

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}));
    return NextResponse.json(err, { status: upstream.status });
  }

  return NextResponse.json(await upstream.json());
}
