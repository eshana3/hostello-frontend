"use client";
import { useAdminStats } from "@/hooks/useAdmin";
import { Crown } from "lucide-react";

export default function AdminUsersPage() {
  const { data: stats, isLoading } = useAdminStats();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-extrabold text-white tracking-tight mb-6">Users</h1>

      <div className="bg-[#13112A] border border-white/[0.08] rounded-2xl shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-white">Top Active Users</h3>
        </div>
        <div className="divide-y divide-white/[0.08]">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-[#252248]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-[#252248] rounded w-1/4" />
                  <div className="h-2.5 bg-[#252248] rounded w-1/3" />
                </div>
              </div>
            ))
          ) : (stats?.topUsers ?? []).map((u: { id: string; avatar: string; name: string; hostel: string; listings: number; sold: number }, i: number) => (
            <div key={u.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#131425] transition-colors">
              <span className="text-lg font-black text-[#3D3B62] w-6 text-center">{i + 1}</span>
              <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{u.name}</p>
                <p className="text-xs text-[#5E5B82]">{u.hostel}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#A78BFA]">{u.listings} listings</p>
                <p className="text-xs text-[#5E5B82]">{u.sold} sold</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
