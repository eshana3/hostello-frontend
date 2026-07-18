import clsx from "clsx";

interface OnlineIndicatorProps {
  online?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export default function OnlineIndicator({ online, size = "sm", className }: OnlineIndicatorProps) {
  return (
    <span
      className={clsx(
        "rounded-full border-2 border-[#0D0D1A] flex-shrink-0",
        size === "sm" ? "w-2.5 h-2.5" : "w-3.5 h-3.5",
        online ? "bg-emerald-400" : "bg-[#6B7280]",
        className
      )}
      title={online ? "Online" : "Offline"}
    />
  );
}
