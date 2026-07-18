"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, MessageCircle, Heart, Plus } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useChats } from "@/hooks/useChats";
import { motion } from "framer-motion";
import clsx from "clsx";

const links = [
  { href: "/",         label: "Home",   icon: Home },
  { href: "/products", label: "Browse", icon: Search },
  { href: "/sell",     label: "Sell",   icon: Plus, isSell: true },
  { href: "/chats",    label: "Chats",  icon: MessageCircle, badgeKey: "chats" },
  { href: "/wishlist", label: "Saved",  icon: Heart, badgeKey: "wishlist" },
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
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 safe-area-bottom"
      style={{
        background: "rgba(6,7,10,0.92)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div className="flex items-end justify-around px-1 pt-2 pb-1">
        {links.map(({ href, label, icon: Icon, badgeKey, isSell }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          const badge  = getBadge(badgeKey);

          if (isSell) {
            return (
              <Link key={href} href={href} className="flex flex-col items-center gap-1 pb-1 -mt-5">
                <motion.div
                  className="relative w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(145deg, #FFB347 0%, #FF8520 45%, #E86000 100%)",
                    boxShadow: [
                      "inset 0 1px 0 rgba(255,255,255,0.30)",
                      "inset 0 -1px 0 rgba(0,0,0,0.18)",
                      "0 4px 8px rgba(0,0,0,0.30)",
                      "0 0 0 4px rgba(6,7,10,0.92)",
                      "0 0 22px rgba(255,122,24,0.55)",
                    ].join(", "),
                  }}
                  whileTap={{ scale: 0.90 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1/2 rounded-t-full pointer-events-none"
                    style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 100%)" }}
                  />
                  <Icon className="w-5 h-5 text-white relative z-10" />
                </motion.div>
                <span className="text-[9px] font-semibold mt-0.5" style={{ color: "#FF9B3D" }}>{label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all active:scale-95 min-w-[52px]"
            >
              <div className="relative">
                <Icon
                  className={clsx(
                    "w-[22px] h-[22px] transition-all duration-200",
                    active ? "scale-110" : "opacity-40"
                  )}
                  style={{ color: active ? "#FF9B3D" : "#fff" }}
                />
                {badge > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-3.5 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </div>
              <span
                className="text-[9px] font-semibold transition-colors"
                style={{ color: active ? "#FF9B3D" : "rgba(255,255,255,0.35)" }}
              >
                {label}
              </span>
              {active && (
                <motion.span
                  layoutId="bottom-nav-indicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                  style={{ background: "linear-gradient(90deg, #FF9B3D, #FF7A18)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
