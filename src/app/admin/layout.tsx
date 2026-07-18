"use client";
import { useAdminCheck } from "@/hooks/useAdmin";
import AdminSidebar, { adminNavItems } from "@/components/admin/AdminSidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShieldX } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAdminCheck();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAdmin) {
      const t = setTimeout(() => router.push("/"), 3000);
      return () => clearTimeout(t);
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
            <ShieldX className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-[#9CA3AF] text-sm">You don&apos;t have admin privileges. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-56px)]">
      {/* Mobile tab bar — AdminSidebar is desktop-only (hidden md:flex), so this is
          the only way to switch admin sections on mobile. */}
      <nav className="md:hidden sticky top-14 z-20 bg-[#0D0B1E] border-b border-white/[0.08] overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 px-3 py-2 w-max min-w-full">
          {adminNavItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0",
                  active ? "bg-[#FF6B00] text-white" : "text-white/60 hover:bg-[#1E1E2E]"
                )}>
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      <AdminSidebar />
      <main className="flex-1 bg-[#0D0D1A] overflow-auto">
        {children}
      </main>
    </div>
  );
}
