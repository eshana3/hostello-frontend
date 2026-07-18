"use client";
import { useState, useRef, useEffect, useCallback, memo } from "react";
import { Bell, MessageCircle, ClipboardList, Heart, CheckCircle, Package, Info, X } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import type { Notification, NotificationType } from "@/types/notification";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

const TYPE_ICON: Record<NotificationType, React.ReactNode> = {
  message:    <MessageCircle className="w-3.5 h-3.5" />,
  poll_reply: <ClipboardList className="w-3.5 h-3.5" />,
  wishlist:   <Heart className="w-3.5 h-3.5" />,
  sold:       <CheckCircle className="w-3.5 h-3.5" />,
  listing:    <Package className="w-3.5 h-3.5" />,
  system:     <Info className="w-3.5 h-3.5" />,
};

const TYPE_COLOR: Record<NotificationType, string> = {
  message:    "bg-[#151521] text-[#FF8C00]",
  poll_reply: "bg-[#151521] text-[#FF8C00]",
  wishlist:   "bg-rose-50 text-rose-600",
  sold:       "bg-emerald-50 text-emerald-600",
  listing:    "bg-[#151521] text-[#FF8C00]",
  system:     "bg-[#151521] text-[#9CA3AF]",
};

const NotifItem = memo(function NotifItem({ n, onRead }: { n: Notification; onRead: (id: string) => void }) {
  const router = useRouter();
  return (
    <button onClick={() => { onRead(n.id); if (n.link) router.push(n.link); }}
      className={clsx(
        "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#151521]",
        !n.read && "bg-[#151521]/50"
      )}>
      <div className="relative flex-shrink-0 mt-0.5">
        {n.avatar ? (
          <img src={n.avatar} alt="" className="w-8 h-8 rounded-full" />
        ) : (
          <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center", TYPE_COLOR[n.type])}>
            {TYPE_ICON[n.type]}
          </div>
        )}
        {!n.read && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#151521]0 rounded-full border-2 border-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={clsx("text-xs leading-snug", n.read ? "text-[#9CA3AF]" : "text-white font-semibold")}>
          {n.title}
        </p>
        <p className="text-xs text-[#9CA3AF] mt-0.5 line-clamp-1">{n.message}</p>
        <p className="text-[10px] text-[#6B7280] mt-1">{timeAgo(n.createdAt)}</p>
      </div>
    </button>
  );
});

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data, markAllRead, markOneRead } = useNotifications(1);
  const notifications = (data?.notifications ?? []).slice(0, 8);
  const unreadCount = data?.unreadCount ?? 0;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleRead = useCallback((id: string) => {
    markOneRead(id);
    setOpen(false);
  }, [markOneRead]);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
        aria-haspopup="menu"
        aria-expanded={open}
        className={clsx(
          "relative p-2 rounded-lg transition-all",
          open ? "bg-[#151521] text-[#FF8C00]" : "text-[#9CA3AF] hover:bg-[#1E1E2E] hover:text-[#C9D1D9]"
        )}>
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[14px] h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed left-4 right-4 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 bg-[#0D0D1A] border border-white/[0.08] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.40)] z-50 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
            <span className="text-sm font-bold text-white">Notifications</span>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button onClick={markAllRead}
                  className="text-xs text-[#FF8C00] hover:text-[#FF6B00] font-semibold transition-colors">
                  Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-[#6B7280] hover:text-[#9CA3AF] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.08]">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center py-10 gap-2">
                <Bell className="w-8 h-8 text-[#1E1E2E]" />
                <p className="text-sm text-[#9CA3AF] font-medium">No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <NotifItem key={n.id} n={n} onRead={handleRead} />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.08] px-4 py-2.5">
            <Link href="/notifications" onClick={() => setOpen(false)}
              className="text-xs text-[#FF8C00] hover:text-[#FF6B00] font-semibold transition-colors">
              See all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
