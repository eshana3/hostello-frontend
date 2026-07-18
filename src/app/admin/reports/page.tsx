"use client";
import dynamic from "next/dynamic";
import { useAdminStats } from "@/hooks/useAdmin";
import { TrendingUp, TrendingDown } from "lucide-react";

const ChartSkeleton = ({ height }: { height: number }) => (
  <div className="animate-pulse rounded-xl bg-[#1E1E2E]" style={{ height }} />
);
const TrendLineChart = dynamic(() => import("@/components/admin/Charts").then(m => m.TrendLineChart), {
  ssr: false, loading: () => <ChartSkeleton height={220} />,
});
const HostelBarChart = dynamic(() => import("@/components/admin/Charts").then(m => m.HostelBarChart), {
  ssr: false, loading: () => <ChartSkeleton height={220} />,
});

export default function AdminReportsPage() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-[#FF6B00] border-t-[#FF6B00] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-extrabold text-white tracking-tight mb-6">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#151521] border border-white/[0.08] rounded-2xl p-5 shadow">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-bold text-white">Listing Growth</span>
          </div>
          <p className="text-3xl font-black text-emerald-600 mb-1">+24%</p>
          <p className="text-xs text-[#9CA3AF]">vs last week</p>
        </div>
        <div className="bg-[#151521] border border-white/[0.08] rounded-2xl p-5 shadow">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-bold text-white">Avg. Time to Sell</span>
          </div>
          <p className="text-3xl font-black text-rose-600 mb-1">2.4 days</p>
          <p className="text-xs text-[#9CA3AF]">down from 3.1 days</p>
        </div>
      </div>

      <div className="bg-[#151521] border border-white/[0.08] rounded-2xl p-5 shadow mb-5">
        <h3 className="text-sm font-bold text-white mb-4">Weekly User Engagement</h3>
        <TrendLineChart data={stats?.dailyUsers ?? []} dataKey="users" color="#FF8C00" name="Users" />
      </div>

      <div className="bg-[#151521] border border-white/[0.08] rounded-2xl p-5 shadow">
        <h3 className="text-sm font-bold text-white mb-4">Listings by Hostel</h3>
        <HostelBarChart data={stats?.hostelActivity ?? []} barColor="#ec4899" barSize={24} />
      </div>
    </div>
  );
}
