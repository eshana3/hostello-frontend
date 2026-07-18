"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Home, Search, ClipboardList, MessageCircle, Heart, Plus, LogOut, User, Trash2, Menu, X, Receipt, Bell, Settings as SettingsIcon } from "lucide-react";
import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/hooks/useWishlist";
import { useChats } from "@/hooks/useChats";
import { useAuth, getAuthToken } from "@/providers/AuthProvider";
import NotificationDropdown from "@/components/NotificationDropdown";
import clsx from "clsx";

function Navbar() {
  const pathname = usePathname();
  const [open, setOpen]               = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting]       = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [isMobile, setIsMobile]       = useState(false);
  const { count: wishlistCount }      = useWishlist();
  const { totalUnread }               = useChats();
  const { user, logout }              = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const token = getAuthToken();
      await fetch("/api/auth/account", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } finally {
      logout();
      setProfileOpen(false);
      setOpen(false);
    }
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  const navLinks = [
    { href: "/",         label: "Home",     icon: Home },
    { href: "/products", label: "Browse",   icon: Search },
    { href: "/polls",    label: "Requests", icon: ClipboardList },
    { href: "/chats",    label: "Chats",    icon: MessageCircle, badge: totalUnread },
    { href: "/wishlist", label: "Wishlist", icon: Heart,         badge: wishlistCount },
  ];

  // Account-level pages — intentionally NOT duplicated in BottomNav or the
  // primary nav list above, per the "no duplicate nav items" audit.
  const accountLinks = [
    { href: "/profile",                    label: "Profile",          icon: User },
    { href: "/profile#purchase-history",   label: "Purchase History", icon: Receipt },
    { href: "/selling-history",            label: "Selling History",  icon: ShoppingBag },
    { href: "/notifications",              label: "Notifications",    icon: Bell },
    { href: "/settings",                   label: "Settings",         icon: SettingsIcon },
  ];

  return (
    <motion.div
      className="sticky top-0 z-40"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav
        className="transition-all duration-300"
        style={{
          background: scrolled ? "rgba(6,7,10,0.88)" : "rgba(6,7,10,0.70)",
          backdropFilter: scrolled ? "blur(28px) saturate(200%)" : "blur(18px) saturate(160%)",
          WebkitBackdropFilter: scrolled ? "blur(28px) saturate(200%)" : "blur(18px) saturate(160%)",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.07)"
            : "1px solid rgba(255,255,255,0.05)",
          boxShadow: scrolled
            ? "0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "none",
        }}
      >
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4"
          style={{
            height: isMobile ? (scrolled ? 48 : 52) : (scrolled ? 52 : 56),
            transition: "height 0.3s ease",
          }}
        >

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-black text-white tracking-tight shrink-0 group">
            <motion.div
              className="w-7 h-7 flex items-center justify-center relative overflow-hidden"
              whileHover={{ scale: 1.08, rotate: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              style={{
                borderRadius: 9,
                background: "linear-gradient(145deg, #FFB347 0%, #FF8520 45%, #E86000 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(0,0,0,0.18), 0 4px 18px rgba(232,96,0,0.55), 0 1px 4px rgba(0,0,0,0.30)",
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
                style={{ borderRadius: "9px 9px 0 0", background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 100%)" }}
              />
              <ShoppingBag
                className="w-3.5 h-3.5 text-white relative z-10"
                style={{ filter: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.32))" }}
              />
            </motion.div>

            {/* Desktop brand — unchanged */}
            <span
              className="hidden sm:inline text-[15px] tracking-tight bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #FF9B3D 0%, #FF7A18 60%, #ffffff 100%)" }}
            >
              Hostel Mart
            </span>

            {/* Mobile two-line brand lockup */}
            <span className="sm:hidden flex flex-col leading-none gap-[3px]">
              <span
                className="text-[14.5px] font-black tracking-tight bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #FF9B3D 0%, #FF7A18 60%, #ffffff 100%)" }}
              >
                HostelMart
              </span>
              <span className="text-[9px] font-semibold text-white/35 tracking-wide">
                Campus Marketplace
              </span>
            </span>
          </Link>

          {/* Desktop nav links */}
          {user && (
            <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
              {navLinks.map(({ href, label, icon: Icon, badge }) => (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150",
                    isActive(href) ? "text-white" : "text-white/50 hover:text-white/80"
                  )}
                >
                  {isActive(href) && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: "rgba(255,122,24,0.12)", border: "1px solid rgba(255,122,24,0.20)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{label}</span>
                  {badge !== undefined && badge > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 z-10">
                      {badge > 9 ? "9+" : badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {user ? (
              <>
                {/* Sell + Request — matched premium pair, same brand orange family */}
                <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }} className="hidden sm:block">
                  <Link
                    href="/sell"
                    className="relative flex items-center gap-1.5 text-white text-[13px] font-semibold px-3.5 py-2 rounded-lg overflow-hidden transition-all duration-150 hover:brightness-110"
                    style={{
                      background: "linear-gradient(145deg, #FFA24D 0%, #FF9B3D 45%, #FF7A18 100%)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(0,0,0,0.18), 0 4px 16px rgba(255,122,24,0.40), 0 1px 4px rgba(0,0,0,0.25)",
                    }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0) 100%)" }} />
                    <Plus className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">Sell</span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }} className="hidden sm:block">
                  <Link
                    href="/polls/new"
                    className="relative flex items-center gap-1.5 text-white text-[13px] font-semibold px-3.5 py-2 rounded-lg overflow-hidden transition-all duration-150 hover:brightness-110"
                    style={{
                      background: "linear-gradient(145deg, #FFB347 0%, #FF8520 45%, #E86000 100%)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(0,0,0,0.18), 0 4px 16px rgba(232,96,0,0.45), 0 1px 4px rgba(0,0,0,0.25)",
                    }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0) 100%)" }} />
                    <Plus className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">Request</span>
                  </Link>
                </motion.div>

                <NotificationDropdown />

                {/* Profile dropdown */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setProfileOpen(o => !o)}
                    aria-label="Account menu"
                    aria-haspopup="menu"
                    aria-expanded={profileOpen}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-150"
                    style={{
                      background: profileOpen ? "rgba(255,255,255,0.07)" : "transparent",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = profileOpen ? "rgba(255,255,255,0.07)" : "transparent")}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(255,122,24,0.20)" }}>
                      <User className="w-3.5 h-3.5 text-[#FF9B3D]" />
                    </div>
                    <span className="text-[13px] font-medium text-white/75 max-w-[72px] truncate">
                      {user?.name?.split(" ")[0]}
                    </span>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                        <motion.div
                          className="absolute right-0 top-11 z-50 p-2 min-w-[210px]"
                          initial={{ opacity: 0, y: -8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.96 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          style={{
                            background: "rgba(9,11,17,0.95)",
                            backdropFilter: "blur(24px)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 16,
                            boxShadow: "0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
                          }}
                        >
                          <div className="px-3 py-2.5 mb-1">
                            <p className="font-semibold text-sm text-white">{user?.name}</p>
                            <p className="text-xs text-white/35 mt-0.5">
                              {typeof user?.hostel === "object" ? user?.hostel?.name : user?.hostel}
                              {user?.email ? " · " + user.email : ""}
                            </p>
                          </div>
                          <div className="h-px mx-2 mb-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                          <button
                            onClick={() => { logout(); setProfileOpen(false); }}
                            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-colors font-medium"
                          >
                            <LogOut className="w-3.5 h-3.5" /> Log out
                          </button>
                          <div className="h-px mx-2 my-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                          {!confirmDelete ? (
                            <button
                              onClick={() => setConfirmDelete(true)}
                              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-white/25 hover:text-rose-400 hover:bg-rose-500/10 transition-colors font-medium"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete account
                            </button>
                          ) : (
                            <div className="px-3 py-2">
                              <p className="text-xs text-white/40 mb-2">This cannot be undone.</p>
                              <div className="flex gap-2">
                                <button
                                  onClick={handleDeleteAccount}
                                  disabled={deleting}
                                  className="flex-1 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
                                >
                                  {deleting ? "Deleting…" : "Yes, delete"}
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(false)}
                                  className="flex-1 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors"
                                  style={{ background: "rgba(255,255,255,0.08)" }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile toggle */}
                <button
                  onClick={() => setOpen(o => !o)}
                  aria-label={open ? "Close menu" : "Open menu"}
                  aria-expanded={open}
                  className="md:hidden p-2 rounded-lg text-white/50 hover:text-white transition-colors"
                  style={{ background: open ? "rgba(255,255,255,0.07)" : "transparent" }}
                >
                  {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <Link
                href="/auth/verify"
                className="text-white text-[13px] font-bold px-6 py-2.5 rounded-full transition-all duration-150"
                style={{
                  background: "linear-gradient(135deg, #FF9B3D 0%, #FF7A18 100%)",
                  boxShadow: "0 3px 12px rgba(255,122,24,0.30)",
                }}
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {open && user && (
            <>
              {/* Click-outside-to-close backdrop */}
              <motion.div
                className="md:hidden fixed inset-0 z-30"
                style={{ background: "rgba(0,0,0,0.35)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="md:hidden overflow-hidden relative z-30"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(6,7,10,0.98)" }}
              >
                <div className="px-4 py-3 flex flex-col gap-1">
                  {navLinks.map(({ href, label, icon: Icon, badge }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={clsx(
                        "relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98]",
                        isActive(href) ? "text-white" : "text-white/50 hover:text-white"
                      )}
                      style={isActive(href) ? { background: "rgba(255,122,24,0.10)", border: "1px solid rgba(255,122,24,0.15)" } : {}}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                      {badge !== undefined && badge > 0 && (
                        <span className="ml-auto min-w-[20px] h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                          {badge > 9 ? "9+" : badge}
                        </span>
                      )}
                    </Link>
                  ))}

                  <div className="mt-2 pt-2 flex flex-col gap-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="px-3 py-1.5 mb-1">
                      <p className="font-semibold text-sm text-white">{user?.name}</p>
                      <p className="text-xs text-white/35">{typeof user?.hostel === "object" ? (user?.hostel as any)?.name : user?.hostel}</p>
                    </div>

                    {accountLinks.map(({ href, label, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white transition-all active:scale-[0.98]"
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Link>
                    ))}

                    <button
                      onClick={() => { logout(); setOpen(false); }}
                      className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors active:scale-[0.98]"
                    >
                      <LogOut className="w-4 h-4" />Log out
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </motion.div>
  );
}

export default memo(Navbar);
