import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: "indigo" | "emerald" | "violet" | "rose" | "purple";
  sub?: string;
  live?: boolean;
}

const colorMap = {
  indigo:  { bg: "bg-[#1E1E2E]",  text: "text-[#FF8C00]",  border: "border-[#1E1E2E]" },
  emerald: { bg: "bg-emerald-900/40", text: "text-emerald-400", border: "border-emerald-900/50" },
  violet:  { bg: "bg-[#1E1E2E]",     text: "text-[#FF8C00]",  border: "border-[#1E1E2E]" },
  rose:    { bg: "bg-rose-900/40",    text: "text-rose-400",    border: "border-rose-900/50" },
  purple:  { bg: "bg-orange-900/40",  text: "text-orange-400",  border: "border-orange-900/50" },
};

export default function StatCard({ label, value, icon: Icon, color, sub, live }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={clsx("bg-[#151521] border rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(255,107,0,0.12)] transition-all duration-200", c.border)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">{label}</p>
          <p className={clsx("text-3xl font-black", c.text)}>{value}</p>
          {sub && <p className="text-xs text-[#9CA3AF] mt-1">{sub}</p>}
        </div>
        <div className={clsx("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", c.bg)}>
          <Icon className={clsx("w-5 h-5", c.text)} />
        </div>
      </div>
      {live && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[#1E1E2E]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-600 font-medium">Live · updates every 30s</span>
        </div>
      )}
    </div>
  );
}
