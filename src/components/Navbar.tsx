"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, X, Home, MessageCircle, ClipboardList, Plus, LogOut, User, Heart } from "lucide-react";
import { useState } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import { useChats } from "@/hooks/useChats";
import { useAuth } from "@/providers/AuthProvider";
import NotificationDropdown from "@/components/NotificationDropdown";
import clsx from "clsx";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { count: wishlistCount } = useWishlist();
  const { totalUnread } = useChats();
  const { user, logout } = useAuth();

  const links = [
    { href: "/",         label: "Home",     icon: Home },
    { href: "/products", label: "Browse",   icon: Search },
    { href: "/polls",    label: "Requests", icon: ClipboardList },
    { href: "/chats",    label: "Chats",    icon: MessageCircle, badge: totalUnread },
    { href: "/wishlist", label: "Wishlist", icon: Heart,         badge: wishlistCount },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <nav className="sticky top-0 z-40 bg-[#080912]/95 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-black text-white tracking-tight shrink-0">
          <div className="w-7 h-7 bg-[#7C3AED] rounded-lg flex items-center justify-center shadow-sm">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <span className="hidden sm:inline text-[15px]">Hostello</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map(({ href, label, icon: Icon, badge }) => (
            <Link key={href} href={href}
              className={clsx(
                "relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150",
                isActive(href)
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-[#1A1830]/10"
              )}>
              <Icon className="w-3.5 h-3.5" />
              {label}
              {badge !== undefined && badge > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Sell */}
          <Link href="/sell"
            className="hidden sm:flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-all duration-150">
            <Plus className="w-3.5 h-3.5" />
            Sell
          </Link>

          {/* Request */}
          <Link href="/polls/new"
            className="hidden sm:flex items-center gap-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[13px] font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-all duration-150">
            <Plus className="w-3.5 h-3.5" />
            Request
          </Link>

          {/* Notifications */}
          <NotificationDropdown />

          {/* Profile */}
          <div className="relative hidden md:block">
            <button onClick={() => setProfileOpen(o => !o)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#1A1830]/10 border border-transparent hover:border-white/20 transition-all duration-150">
              <div className="w-6 h-6 rounded-full bg-[#7C3AED]/30 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-[#A78BFA]" />
              </div>
              <span className="text-[13px] font-medium text-white/80 max-w-[72px] truncate">
                {user?.name?.split(" ")[0]}
              </span>
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-10 z-50 bg-[#0D0E1C] border border-white/[0.08] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.50)] p-2 min-w-[200px] animate-fade-in">
                  <div className="px-3 py-2.5 mb-1">
                    <p className="font-semibold text-sm text-white">{user?.name}</p>
                    <p className="text-xs text-white/40 mt-0.5">{user?.hostel} · +91 {user?.mobile}</p>
                  </div>
                  <div className="h-px bg-white/[0.08] mx-2 mb-1" />
                  <button onClick={() => { logout(); setProfileOpen(false); }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-colors font-medium">
                    <LogOut className="w-3.5 h-3.5" /> Log out
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setOpen(o => !o)}
            className="md:hidden p-2 rounded-lg text-white/60 hover:bg-[#1A1830]/10 transition-colors">
            {open ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0D0E1C] px-4 py-3 flex flex-col gap-1 animate-fade-in">
          {links.map(({ href, label, icon: Icon, badge }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className={clsx(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive(href)
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-[#1A1830]/10 hover:text-white"
              )}>
              <Icon className="w-4 h-4" />
              {label}
              {badge !== undefined && badge > 0 && (
                <span className="ml-auto min-w-[20px] h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </Link>
          ))}

          <div className="grid grid-cols-2 gap-2 mt-1">
            <Link href="/sell" onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 text-white">
              <Plus className="w-4 h-4" />Sell
            </Link>
            <Link href="/polls/new" onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold bg-[#7C3AED] text-white">
              <Plus className="w-4 h-4" />Request
            </Link>
          </div>

          <div className="border-t border-white/[0.08] mt-2 pt-2">
            <div className="px-3 py-1.5 mb-1">
              <p className="font-semibold text-sm text-white">{user?.name}</p>
              <p className="text-xs text-white/40">{user?.hostel}</p>
            </div>
            <button onClick={() => { logout(); setOpen(false); }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors">
              <LogOut className="w-4 h-4" />Log out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
