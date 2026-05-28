import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: "indigo" | "emerald" | "violet" | "rose" | "amber";
  sub?: string;
  live?: boolean;
}

const colorMap = {
  indigo:  { bg: "bg-[#3D2785]",  text: "text-[#A78BFA]",  border: "border-[#3D2785]" },
  emerald: { bg: "bg-emerald-900/40", text: "text-emerald-400", border: "border-emerald-900/50" },
  violet:  { bg: "bg-[#3D2785]",     text: "text-[#A78BFA]",  border: "border-[#3D2785]" },
  rose:    { bg: "bg-rose-900/40",    text: "text-rose-400",    border: "border-rose-900/50" },
  amber:   { bg: "bg-amber-900/40",   text: "text-amber-400",   border: "border-amber-900/50" },
};

export default function StatCard({ label, value, icon: Icon, color, sub, live }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={clsx("bg-[#13112A] border rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(124,58,237,0.12)] transition-all duration-200", c.border)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#7B78A0] uppercase tracking-wide mb-1">{label}</p>
          <p className={clsx("text-3xl font-black", c.text)}>{value}</p>
          {sub && <p className="text-xs text-[#5E5B82] mt-1">{sub}</p>}
        </div>
        <div className={clsx("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", c.bg)}>
          <Icon className={clsx("w-5 h-5", c.text)} />
        </div>
      </div>
      {live && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[#252248]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-600 font-medium">Live · updates every 30s</span>
        </div>
      )}
    </div>
  );
}
