"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Users, BarChart3, ShieldCheck, ChevronRight
} from "lucide-react";
import clsx from "clsx";

export const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/products",  label: "Products",   icon: Package },
  { href: "/admin/users",     label: "Users",      icon: Users },
  { href: "/admin/reports",   label: "Reports",    icon: BarChart3 },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 flex-shrink-0 hidden md:flex flex-col bg-[#0D0B1E] border-r border-white/[0.08] min-h-[calc(100vh-56px)] sticky top-14">
      {/* Admin badge */}
      <div className="px-4 py-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF6B00] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Admin Panel</p>
            <p className="text-[10px] text-[#9CA3AF]">Hostel Mart</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {adminNavItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                active
                  ? "bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]"
                  : "text-white/60 hover:bg-[#1E1E2E]/10 hover:text-[#FFFFFF]"
              )}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/[0.08]">
        <Link href="/" className="flex items-center gap-2 text-xs text-[#9CA3AF] hover:text-[#9CA3AF] px-3 py-2 rounded-lg hover:bg-[#151521] transition-all">
          ← Back to marketplace
        </Link>
      </div>
    </aside>
  );
}
