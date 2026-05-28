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
        "rounded-full border-2 border-[#0C0A1E] flex-shrink-0",
        size === "sm" ? "w-2.5 h-2.5" : "w-3.5 h-3.5",
        online ? "bg-emerald-400" : "bg-[#3D3B62]",
        className
      )}
      title={online ? "Online" : "Offline"}
    />
  );
}
