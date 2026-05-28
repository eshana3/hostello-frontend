import { NextResponse } from "next/server";
import type { HostelGroup } from "@/types";

const KP_HOSTELS = Array.from({ length: 25 }, (_, i) => ({
  id: `KP-${i + 1}`,
  name: `KP-${i + 1}`,
  type: "KP" as const,
}));

const QC_HOSTELS = Array.from({ length: 13 }, (_, i) => ({
  id: `QC-${i + 1}`,
  name: `QC-${i + 1}`,
  type: "QC" as const,
}));

const HOSTEL_GROUPS: HostelGroup[] = [
  { type: "KP", label: "KP Hostels (Boys)", hostels: KP_HOSTELS },
  { type: "QC", label: "QC Hostels (Girls)", hostels: QC_HOSTELS },
];

export async function GET() {
  return NextResponse.json(HOSTEL_GROUPS);
}
