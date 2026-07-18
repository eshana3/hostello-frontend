"use client";
import dynamic from "next/dynamic";
import { useAdminStats } from "@/hooks/useAdmin";
import StatCard from "@/components/admin/StatCard";
import {
  Users, Package, ShoppingBag, CheckCircle, Wifi,
  Clock, MapPin, Tag
} from "lucide-react";
import clsx from "clsx";

// recharts is the heaviest dependency in the app — only admin pages need it,
// so it's dynamically imported here instead of bundled into every route.
const ChartSkeleton = ({ height }: { height: number }) => (
  <div className="animate-pulse rounded-xl bg-[#1E1E2E]" style={{ height }} />
);
const HostelBarChart = dynamic(() => import("@/components/admin/Charts").then(m => m.HostelBarChart), {
  ssr: false, loading: () => <ChartSkeleton height={220} />,
});
const CategoryPieChart = dynamic(() => import("@/components/admin/Charts").then(m => m.CategoryPieChart), {
  ssr: false, loading: () => <ChartSkeleton height={220} />,
});
const TrendLineChart = dynamic(() => import("@/components/admin/Charts").then(m => m.TrendLineChart), {
  ssr: false, loading: () => <ChartSkeleton height={200} />,
});

const ACTIVITY_ICONS: Record<string, string> = {
  listing: "🏷️",
  sale:    "✅",
  user:    "👤",
  chat:    "💬",
  poll:    "📋",
};

const ACTIVITY_COLORS: Record<string, string> = {
  listing: "bg-[#1E1E2E] text-[#FF6B00]",
  sale:    "bg-emerald-900/40 text-emerald-400",
  user:    "bg-[#1E1E2E] text-[#FF6B00]",
  chat:    "bg-blue-900/40 text-blue-400",
  poll:    "bg-orange-900/40 text-orange-400",
};

function ChartCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx("bg-[#151521] border border-[#1E1E2E] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]", className)}>
      <h3 className="text-sm font-bold text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading, isError, dataUpdatedAt } = useAdminStats();

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#FF6B00] border-t-[#FF6B00] rounded-full animate-spin" />
        <p className="text-[#9CA3AF] text-sm">Loading dashboard...</p>
      </div>
    </div>
  );

  if (isError || !stats) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-[#9CA3AF]">Failed to load stats. Try refreshing.</p>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-[#9CA3AF] mt-0.5">
            Last updated: {new Date(dataUpdatedAt).toLocaleTimeString("en-IN")}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Users"      value={stats.totalUsers}    icon={Users}       color="indigo"  sub="registered" />
        <StatCard label="Total Products"   value={stats.totalProducts} icon={Package}     color="violet"  sub="all time" />
        <StatCard label="Active Listings"  value={stats.activeListings}icon={ShoppingBag} color="emerald" sub="available now" />
        <StatCard label="Sold Products"    value={stats.soldProducts}  icon={CheckCircle} color="purple"  sub="completed" />
        <StatCard label="Live Users"       value={stats.liveUsers}     icon={Wifi}        color="rose"    live />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Bar: hostel activity */}
        <ChartCard title="🏠 Most Active Hostels">
          <HostelBarChart data={stats.hostelActivity} />
        </ChartCard>

        {/* Pie: category breakdown */}
        <ChartCard title="🏷️ Most Sold Categories">
          <CategoryPieChart data={stats.categoryBreakdown} />
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Line: daily active users */}
        <ChartCard title="📈 Daily Active Users (Last 7 Days)">
          <TrendLineChart data={stats.dailyUsers} dataKey="users" color="#FF8C00" name="Users" />
        </ChartCard>

        {/* Line: chat activity */}
        <ChartCard title="💬 Chat Activity (Last 7 Days)">
          <TrendLineChart data={stats.chatActivity} dataKey="messages" color="#ec4899" name="Messages" />
        </ChartCard>
      </div>

      {/* Recent activity */}
      <div className="bg-[#151521] border border-white/[0.08] rounded-2xl shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-[#C9D1D9]">🕐 Recent Activity</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {stats.recentActivity.map((a: { id: string; type: string; description: string; user: string; hostel: string; time: string }) => (
            <div key={a.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-5 py-3 hover:bg-[#151521]/60 transition-colors">
              <div className="flex items-center gap-2 min-w-0 sm:flex-1">
                <span className={clsx("text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0", ACTIVITY_COLORS[a.type] ?? "bg-[#1E1E2E] text-[#9CA3AF]")}>
                  {ACTIVITY_ICONS[a.type]} {a.type}
                </span>
                <p className="text-sm text-[#C9D1D9] flex-1 min-w-0 truncate">{a.description}</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap sm:flex-shrink-0 text-xs text-[#9CA3AF]">
                <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{a.user}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{a.hostel}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
