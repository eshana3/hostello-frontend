"use client";
import { useAdminStats } from "@/hooks/useAdmin";
import StatCard from "@/components/admin/StatCard";
import {
  Users, Package, ShoppingBag, CheckCircle, Wifi,
  Clock, MapPin, Tag
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from "recharts";
import clsx from "clsx";

const PIE_COLORS = ["#A78BFA", "#ec4899", "#10b981", "#f59e0b", "#0ea5e9", "#8b5cf6"];

const ACTIVITY_ICONS: Record<string, string> = {
  listing: "🏷️",
  sale:    "✅",
  user:    "👤",
  chat:    "💬",
  poll:    "📋",
};

const ACTIVITY_COLORS: Record<string, string> = {
  listing: "bg-[#3D2785] text-[#8B5CF6]",
  sale:    "bg-emerald-900/40 text-emerald-400",
  user:    "bg-[#3D2785] text-[#8B5CF6]",
  chat:    "bg-blue-900/40 text-blue-400",
  poll:    "bg-amber-900/40 text-amber-400",
};

function ChartCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx("bg-[#13112A] border border-[#252248] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]", className)}>
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
        <div className="w-10 h-10 border-4 border-[#4C3699] border-t-[#7C3AED] rounded-full animate-spin" />
        <p className="text-[#5E5B82] text-sm">Loading dashboard...</p>
      </div>
    </div>
  );

  if (isError || !stats) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-[#7B78A0]">Failed to load stats. Try refreshing.</p>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-[#5E5B82] mt-0.5">
            Last updated: {new Date(dataUpdatedAt).toLocaleTimeString("en-IN")}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Users"      value={stats.totalUsers}    icon={Users}       color="indigo"  sub="registered" />
        <StatCard label="Total Products"   value={stats.totalProducts} icon={Package}     color="violet"  sub="all time" />
        <StatCard label="Active Listings"  value={stats.activeListings}icon={ShoppingBag} color="emerald" sub="available now" />
        <StatCard label="Sold Products"    value={stats.soldProducts}  icon={CheckCircle} color="amber"   sub="completed" />
        <StatCard label="Live Users"       value={stats.liveUsers}     icon={Wifi}        color="rose"    live />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Bar: hostel activity */}
        <ChartCard title="🏠 Most Active Hostels">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.hostelActivity} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hostel" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar dataKey="listings" fill="#A78BFA" radius={[6, 6, 0, 0]} name="Listings" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pie: category breakdown */}
        <ChartCard title="🏷️ Most Sold Categories">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={stats.categoryBreakdown}
                dataKey="sold"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={3}
              >
                {stats.categoryBreakdown.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                formatter={(val, name) => [`${val} sold`, name]}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Line: daily active users */}
        <ChartCard title="📈 Daily Active Users (Last 7 Days)">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.dailyUsers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Line
                type="monotone" dataKey="users" stroke="#A78BFA" strokeWidth={2.5}
                dot={{ fill: "#A78BFA", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6 }} name="Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Line: chat activity */}
        <ChartCard title="💬 Chat Activity (Last 7 Days)">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.chatActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Line
                type="monotone" dataKey="messages" stroke="#ec4899" strokeWidth={2.5}
                dot={{ fill: "#ec4899", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6 }} name="Messages"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent activity */}
      <div className="bg-[#13112A] border border-white/[0.08] rounded-2xl shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-[#B5B2D8]">🕐 Recent Activity</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {stats.recentActivity.map((a) => (
            <div key={a.id} className="flex items-center gap-4 px-5 py-3 hover:bg-[#13112A]/60 transition-colors">
              <span className={clsx("text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0", ACTIVITY_COLORS[a.type] ?? "bg-[#1A1830] text-[#9896B8]")}>
                {ACTIVITY_ICONS[a.type]} {a.type}
              </span>
              <p className="text-sm text-[#B5B2D8] flex-1 min-w-0 truncate">{a.description}</p>
              <div className="flex items-center gap-3 flex-shrink-0 text-xs text-[#5E5B82]">
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
