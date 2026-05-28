"use client";
import { useAdminStats } from "@/hooks/useAdmin";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function AdminReportsPage() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-[#4C3699] border-t-[#7C3AED] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-extrabold text-white tracking-tight mb-6">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#13112A] border border-white/[0.08] rounded-2xl p-5 shadow">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-bold text-white">Listing Growth</span>
          </div>
          <p className="text-3xl font-black text-emerald-600 mb-1">+24%</p>
          <p className="text-xs text-[#5E5B82]">vs last week</p>
        </div>
        <div className="bg-[#13112A] border border-white/[0.08] rounded-2xl p-5 shadow">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-bold text-white">Avg. Time to Sell</span>
          </div>
          <p className="text-3xl font-black text-rose-600 mb-1">2.4 days</p>
          <p className="text-xs text-[#5E5B82]">down from 3.1 days</p>
        </div>
      </div>

      <div className="bg-[#13112A] border border-white/[0.08] rounded-2xl p-5 shadow mb-5">
        <h3 className="text-sm font-bold text-white mb-4">Weekly User Engagement</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={stats?.dailyUsers ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
            <Line type="monotone" dataKey="users" stroke="#A78BFA" strokeWidth={2.5}
              dot={{ fill: "#A78BFA", r: 4 }} activeDot={{ r: 6 }} name="Users" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#13112A] border border-white/[0.08] rounded-2xl p-5 shadow">
        <h3 className="text-sm font-bold text-white mb-4">Listings by Hostel</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={stats?.hostelActivity ?? []} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="hostel" tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} cursor={{ fill: "#f8fafc" }} />
            <Bar dataKey="listings" fill="#ec4899" radius={[6, 6, 0, 0]} name="Listings" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
