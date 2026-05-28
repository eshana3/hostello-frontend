"use client";
import { useCategories } from "@/hooks/useCategories";
import { useHostels } from "@/hooks/useHostels";
import type { ProductFilters } from "@/types";
import { SlidersHorizontal, X } from "lucide-react";

interface Props {
  filters: ProductFilters;
  onFilterChange: (key: string, value: string | null) => void;
}

const CONDITIONS = [
  { id: "new",      label: "New"      },
  { id: "like_new", label: "Like New" },
  { id: "good",     label: "Good"     },
  { id: "fair",     label: "Fair"     },
  { id: "poor",     label: "Poor"     },
];

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-[#5E5B82] uppercase tracking-widest mb-2.5">{title}</p>
      {children}
    </div>
  );
}

export default function FilterSidebar({ filters, onFilterChange }: Props) {
  const { categories }       = useCategories();
  const { data: hostelGroups } = useHostels();

  const activeCount = ["category","hostel","condition","minPrice","maxPrice"]
    .filter(k => (filters as Record<string,unknown>)[k]).length;

  return (
    <aside className="w-56 shrink-0 hidden lg:block">
      <div className="bg-[#13112A] rounded-2xl border border-[#252248] shadow-[0_1px_3px_rgba(0,0,0,0.3)] p-4 sticky top-20 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#7B78A0]" />
            <span className="text-sm font-bold text-white">Filters</span>
            {activeCount > 0 && (
              <span className="w-4 h-4 bg-[#7C3AED] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </div>
          {activeCount > 0 && (
            <button
              onClick={() => { onFilterChange("category",null); onFilterChange("hostel",null); onFilterChange("condition",null); onFilterChange("minPrice",null); onFilterChange("maxPrice",null); }}
              className="text-[10px] font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-0.5 transition-colors">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        <div className="h-px bg-[#252248]" />

        {/* Category */}
        <FilterSection title="Category">
          <select value={filters.category ?? ""} onChange={e => onFilterChange("category", e.target.value || null)}
            className="w-full border border-white/[0.08] rounded-xl px-3 py-2 text-xs bg-[#1A1830] text-[#B5B2D8] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#4C3699] transition-all appearance-none">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
        </FilterSection>

        {/* Hostel */}
        <FilterSection title="Hostel">
          <select value={filters.hostel ?? ""} onChange={e => onFilterChange("hostel", e.target.value || null)}
            className="w-full border border-white/[0.08] rounded-xl px-3 py-2 text-xs bg-[#1A1830] text-[#B5B2D8] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#4C3699] transition-all appearance-none">
            <option value="">All Hostels</option>
            {(hostelGroups ?? []).map(group => (
              <optgroup key={group.type} label={group.label}>
                {group.hostels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </optgroup>
            ))}
          </select>
        </FilterSection>

        {/* Condition */}
        <FilterSection title="Condition">
          <div className="space-y-1.5">
            {CONDITIONS.map(c => (
              <label key={c.id}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer text-xs font-medium transition-all ${
                  filters.condition === c.id
                    ? "bg-[#2D1B69] text-[#8B5CF6] border border-[#3D2785]"
                    : "text-white/60 hover:bg-[#1A1830]/10 border border-transparent"
                }`}>
                <input type="radio" name="condition" value={c.id}
                  checked={filters.condition === c.id}
                  onChange={() => onFilterChange("condition", c.id)}
                  className="accent-[#7C3AED] w-3 h-3" />
                {c.label}
              </label>
            ))}
            {filters.condition && (
              <button onClick={() => onFilterChange("condition", null)}
                className="text-[10px] text-[#5E5B82] hover:text-[#9896B8] mt-1 transition-colors">
                Clear condition
              </button>
            )}
          </div>
        </FilterSection>

        {/* Price */}
        <FilterSection title="Price Range (₹)">
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Min" min={0}
              defaultValue={filters.minPrice ?? ""}
              onBlur={e => onFilterChange("minPrice", e.target.value || null)}
              className="w-full border border-white/[0.08] rounded-xl px-2.5 py-2 text-xs bg-[#1A1830] text-[#B5B2D8] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#4C3699] transition-all" />
            <span className="text-[#3D3B62] text-xs shrink-0">–</span>
            <input type="number" placeholder="Max" min={0}
              defaultValue={filters.maxPrice ?? ""}
              onBlur={e => onFilterChange("maxPrice", e.target.value || null)}
              className="w-full border border-white/[0.08] rounded-xl px-2.5 py-2 text-xs bg-[#1A1830] text-[#B5B2D8] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#4C3699] transition-all" />
          </div>
        </FilterSection>
      </div>
    </aside>
  );
}
