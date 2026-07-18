/**
 * Single source of truth for hostel ordering across the entire frontend.
 *
 * Required order:
 *   Girls hostels first — QC-1 … QC-25, then KP-1 … KP-25
 *   Followed by any future hostel types.
 *
 * Import these constants instead of re-declaring arrays in individual files.
 */

/** QC hostel names in numerical order (QC-1 through QC-25) */
export const QC_HOSTELS: string[] = Array.from(
  { length: 25 },
  (_, i) => `QC-${i + 1}`
);

/** KP hostel names in numerical order (KP-1 through KP-25) */
export const KP_HOSTELS: string[] = Array.from(
  { length: 25 },
  (_, i) => `KP-${i + 1}`
);

/** Canonical hostel groups — girls hostels (QC then KP) first */
export const HOSTEL_GROUPS: Array<{
  id: string;
  name: string;
  hostels: string[];
}> = [
  { id: "QC", name: "QC Hostels (Girls)", hostels: QC_HOSTELS },
  { id: "KP", name: "KP Hostels (Girls)", hostels: KP_HOSTELS },
];

/** Flat ordered list for simple <select> without <optgroup> */
export const ALL_HOSTELS_ORDERED: string[] = [
  ...QC_HOSTELS,
  ...KP_HOSTELS,
];

/**
 * Sort an array of hostel groups fetched dynamically from an API so that
 * QC always appears before KP, and any unknown types follow alphabetically.
 * Within each group, hostel names are sorted numerically (QC-1 before QC-10).
 */
export function sortHostelGroups<
  T extends { id: string; hostels: string[] }
>(groups: T[]): T[] {
  const TYPE_ORDER: Record<string, number> = { QC: 0, KP: 1 };

  return [...groups]
    .sort((a, b) => {
      const ao = TYPE_ORDER[a.id] ?? 99;
      const bo = TYPE_ORDER[b.id] ?? 99;
      return ao - bo;
    })
    .map((g) => ({
      ...g,
      hostels: [...g.hostels].sort((a, b) => {
        // Numeric sort: "QC-9" before "QC-10"
        const na = parseInt(a.split("-")[1] ?? "0", 10);
        const nb = parseInt(b.split("-")[1] ?? "0", 10);
        return na - nb;
      }),
    }));
}
