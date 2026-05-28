"use client";
import { useAdminCheck } from "@/hooks/useAdmin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShieldX } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAdminCheck();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      const t = setTimeout(() => router.push("/"), 3000);
      return () => clearTimeout(t);
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#080912] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
            <ShieldX className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-[#7B78A0] text-sm">You don't have admin privileges. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      <AdminSidebar />
      <main className="flex-1 bg-[#080912] overflow-auto">
        {children}
      </main>
    </div>
  );
}
