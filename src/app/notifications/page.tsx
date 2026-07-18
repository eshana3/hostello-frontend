"use client";
import { useState, memo } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell, CheckCheck, MessageCircle, ClipboardList, Heart, CheckCircle, Package, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/Skeleton";
import PageTransition from "@/components/PageTransition";
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
  message:    <MessageCircle className="w-4 h-4" />,
  poll_reply: <ClipboardList className="w-4 h-4" />,
  wishlist:   <Heart className="w-4 h-4" />,
  sold:       <CheckCircle className="w-4 h-4" />,
  listing:    <Package className="w-4 h-4" />,
  system:     <Info className="w-4 h-4" />,
};

const TYPE_COLOR: Record<NotificationType, string> = {
  message:    "bg-[#151521] text-[#FF8C00]",
  poll_reply: "bg-[#151521] text-[#FF8C00]",
  wishlist:   "bg-rose-50 text-rose-600",
  sold:       "bg-emerald-50 text-emerald-600",
  listing:    "bg-[#151521] text-[#FF8C00]",
  system:     "bg-[#151521] text-[#9CA3AF]",
};

const NotifRow = memo(function NotifRow({ n, onRead }: { n: Notification; onRead: (id: string) => void }) {
  const router = useRouter();
  return (
    <button onClick={() => { onRead(n.id); if (n.link) router.push(n.link); }}
      className={clsx(
        "w-full flex items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-[#151521]",
        !n.read && "bg-[#151521]/40"
      )}>
      <div className="relative flex-shrink-0">
        {n.avatar ? (
          <img src={n.avatar} alt="" className="w-10 h-10 rounded-full" />
        ) : (
          <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", TYPE_COLOR[n.type])}>
            {TYPE_ICON[n.type]}
          </div>
        )}
        {!n.read && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#151521]0 rounded-full border-2 border-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={clsx("text-sm leading-snug", n.read ? "text-[#9CA3AF]" : "font-semibold text-white")}>
          {n.title}
        </p>
        <p className="text-sm text-[#9CA3AF] mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
        <p className="text-xs text-[#6B7280] mt-1.5">{timeAgo(n.createdAt)}</p>
      </div>
    </button>
  );
});

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, markAllRead, markOneRead } = useNotifications(page);

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;
  const total = data?.total ?? 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0D0D1A]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#151521] flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#FF8C00]" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-xs text-[#FF8C00] font-semibold mt-0.5">{unreadCount} unread</p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead}
                className="flex items-center gap-1.5 text-sm font-semibold text-[#FF8C00] hover:text-[#FF6B00] transition-colors">
                <CheckCheck className="w-4 h-4" />Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="bg-[#151521] border border-white/[0.08] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-white/[0.08]">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-4">
                  <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-2.5 w-3/4" />
                    <Skeleton className="h-2 w-1/4" />
                  </div>
                </div>
              ))
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center py-16 gap-3">
                <Bell className="w-10 h-10 text-[#1E1E2E]" />
                <p className="text-white font-semibold">All caught up!</p>
                <p className="text-[#9CA3AF] text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <NotifRow key={n.id} n={n} onRead={markOneRead} />
              ))
            )}
          </div>

          {/* Pagination */}
          {total > 20 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-white/[0.08] bg-[#1E1E2E] disabled:opacity-40 hover:bg-[#151521] transition-all text-[#9CA3AF]">
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-[#9CA3AF]">Page {page}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={notifications.length < 20}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-white/[0.08] bg-[#1E1E2E] disabled:opacity-40 hover:bg-[#151521] transition-all text-[#9CA3AF]">
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
