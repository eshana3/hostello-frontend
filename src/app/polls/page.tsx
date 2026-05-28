"use client";
import { useState } from "react";
import { usePolls } from "@/hooks/usePolls";
import { useCategories } from "@/hooks/useCategories";
import { useHostels } from "@/hooks/useHostels";
import Link from "next/link";
import { Search, Plus, MessageSquare, Clock, IndianRupee, ChevronDown } from "lucide-react";
import type { Poll } from "@/types/poll";
import clsx from "clsx";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function PollCard({ poll }: { poll: Poll }) {
  return (
    <Link href={`/polls/${poll.id}`}
      className="block bg-[#13112A] border border-white/[0.08] rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={clsx(
            "text-[11px] font-bold px-2.5 py-1 rounded-full border",
            poll.status === "open"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-[#131425] text-[#7B78A0] border-white/[0.08]"
          )}>
            {poll.status === "open" ? "Open" : "Closed"}
          </span>
          <span className="text-[11px] font-semibold bg-[#2D1B69] text-[#A78BFA] border border-[#3D2785] px-2.5 py-1 rounded-full">{poll.category}</span>
        </div>
        <span className="text-[11px] text-[#5E5B82] flex-shrink-0 flex items-center gap-1">
          <Clock className="w-3 h-3" />{timeAgo(poll.createdAt)}
        </span>
      </div>

      <h3 className="font-bold text-white text-base mb-1 leading-snug">{poll.itemName}</h3>
      <p className="text-sm text-[#7B78A0] line-clamp-2 leading-relaxed mb-3">{poll.description}</p>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <img src={poll.buyerAvatar} alt={poll.buyerName} className="w-6 h-6 rounded-full" />
          <span className="text-xs text-[#9896B8] font-semibold">{poll.buyerName}</span>
          <span className="text-xs text-[#5E5B82]">· {poll.hostelId}</span>
        </div>
        <div className="flex items-center gap-3">
          {poll.maxPrice && (
            <span className="text-xs font-bold text-[#A78BFA] flex items-center gap-0.5">
              <IndianRupee className="w-3 h-3" />up to {poll.maxPrice.toLocaleString()}
            </span>
          )}
          <span className="text-xs text-[#5E5B82] flex items-center gap-1 font-medium">
            <MessageSquare className="w-3.5 h-3.5" />{poll.replyCount} {poll.replyCount === 1 ? "reply" : "replies"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function PollsPage() {
  const { data: allPolls = [], isLoading } = usePolls();
  const { categories } = useCategories();
  const { data: hostelGroups = [] } = useHostels();

  const [search, setSearch] = useState("");
  const [hostel, setHostel] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"open" | "closed" | "all">("open");

  const filtered = allPolls
    .filter(p => status === "all" ? true : p.status === status)
    .filter(p => !hostel || p.hostelId === hostel)
    .filter(p => !category || p.category === category)
    .filter(p => !search ||
      p.itemName.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-[#080912]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Buyer Requests</h1>
            <p className="text-sm text-[#5E5B82] mt-0.5">Can't find what you need? Post a request and let sellers find you.</p>
          </div>
          <Link href="/polls/new"
            className="flex items-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-[#3D2785] transition-all text-sm">
            <Plus className="w-4 h-4" />Post a Request
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-[#13112A] border border-white/[0.08] rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3D3B62]" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search requests…"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-white/[0.08] bg-[#080912] text-sm text-white placeholder:text-[#3D3B62] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#4C3699] transition-all"
            />
          </div>

          {/* Status tabs */}
          <div className="flex gap-1 bg-[#131425] rounded-xl p-1">
            {(["open", "closed", "all"] as const).map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
                  status === s ? "bg-[#252248] text-[#A78BFA] shadow-sm" : "text-[#5E5B82] hover:text-[#B5B2D8]"
                )}>
                {s}
              </button>
            ))}
          </div>

          <div className="relative">
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-white/[0.08] bg-[#080912] text-sm text-white focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#4C3699] transition-all cursor-pointer">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5E5B82] pointer-events-none" />
          </div>

          <div className="relative">
            <select value={hostel} onChange={e => setHostel(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-white/[0.08] bg-[#080912] text-sm text-white focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#4C3699] transition-all cursor-pointer">
              <option value="">All Hostels</option>
              {hostelGroups.map((g: any) => (
                <optgroup key={g.id} label={g.name}>
                  {(g.hostels ?? []).map((h: string) => <option key={h} value={h}>{h}</option>)}
                </optgroup>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5E5B82] pointer-events-none" />
          </div>
        </div>

        {/* Poll list */}
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-[#13112A] border border-white/[0.08] rounded-2xl p-4 animate-pulse h-28" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#131425] flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-[#3D3B62]" />
            </div>
            <p className="text-white font-semibold">No requests found</p>
            <Link href="/polls/new"
              className="flex items-center gap-2 text-sm text-[#A78BFA] hover:text-[#7C3AED] font-semibold transition-colors">
              <Plus className="w-4 h-4" />Be the first to post a request
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(p => <PollCard key={p.id} poll={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
