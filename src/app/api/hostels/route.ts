import { NextResponse } from "next/server";
import { HOSTEL_GROUPS } from "@/lib/hostelUtils";

/**
 * GET /api/hostels
 *
 * Returns hostel groups in canonical order:
 *   QC (Girls) first, then KP (Girls).
 * Consumed by useHostels() → FilterSidebar, polls/new, polls/page.
 */
export async function GET() {
  return NextResponse.json(HOSTEL_GROUPS);
}
