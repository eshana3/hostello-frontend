"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, MessageCircle, Heart, PlusCircle } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useChats } from "@/hooks/useChats";
import clsx from "clsx";

const links = [
  { href: "/",         label: "Home",    icon: Home },
  { href: "/products", label: "Browse",  icon: Search },
  { href: "/sell",     label: "Sell",    icon: PlusCircle, isSell: true },
  { href: "/chats",    label: "Chats",   icon: MessageCircle, badgeKey: "chats" },
  { href: "/wishlist", label: "Saved",   icon: Heart, badgeKey: "wishlist" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { count: wishlistCount } = useWishlist();
  const { totalUnread: chatCount } = useChats();

  const getBadge = (key?: string) => {
    if (key === "chats")    return chatCount;
    if (key === "wishlist") return wishlistCount;
    return 0;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080912]/95 backdrop-blur-xl border-t border-white/[0.08] safe-area-bottom">
      <div className="flex items-end justify-around px-1 pt-2 pb-1">
        {links.map(({ href, label, icon: Icon, badgeKey, isSell }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          const badge  = getBadge(badgeKey);

          if (isSell) {
            return (
              <Link key={href} href={href}
                className="flex flex-col items-center gap-0.5 pb-1 -mt-4">
                <div className="w-11 h-11 bg-emerald-500 hover:bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/50 transition-all active:scale-95">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[9px] font-semibold text-emerald-400 mt-0.5">{label}</span>
              </Link>
            );
          }

          return (
            <Link key={href} href={href}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all active:scale-95">
              <div className="relative">
                <Icon className={clsx(
                  "w-[22px] h-[22px] transition-all duration-150",
                  active ? "text-[#A78BFA] scale-110" : "text-white/40"
                )} />
                {badge > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-3.5 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </div>
              <span className={clsx(
                "text-[9px] font-semibold transition-colors",
                active ? "text-[#A78BFA]" : "text-white/40"
              )}>
                {label}
              </span>
              {active && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#7C3AED] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
