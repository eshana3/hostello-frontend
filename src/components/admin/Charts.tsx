"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from "recharts";

const PIE_COLORS = ["#FF8C00", "#ec4899", "#10b981", "#FF6B00", "#0ea5e9", "#FFD4A0"];

export function HostelBarChart({
  data, barColor = "#FF8C00", dataKey = "listings", height = 220, barSize = 28,
}: { data: any[]; barColor?: string; dataKey?: string; height?: number; barSize?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barSize={barSize}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="hostel" tick={{ fontSize: 11, fill: "#94a3b8" }} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} cursor={{ fill: "#f8fafc" }} />
        <Bar dataKey={dataKey} fill={barColor} radius={[6, 6, 0, 0]} name="Listings" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CategoryPieChart({ data, height = 220 }: { data: any[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="sold" nameKey="category" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3}>
          {data.map((_: unknown, i: number) => (
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
  );
}

export function TrendLineChart({
  data, dataKey, color, name, xKey = "date", height = 200,
}: { data: any[]; dataKey: string; color: string; name: string; xKey?: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#94a3b8" }} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
        <Line
          type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5}
          dot={{ fill: color, strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6 }} name={name}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
