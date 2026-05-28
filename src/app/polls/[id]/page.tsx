"use client";
import { useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePoll } from "@/hooks/usePolls";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/providers/ToastProvider";
import { CURRENT_USER_ID } from "@/lib/mockChats";
import {
  ArrowLeft, MessageSquare, Clock, IndianRupee, CheckCircle,
  XCircle, MapPin, Tag, Send, Loader2
} from "lucide-react";
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

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-[#080912] text-white placeholder:text-[#3D3B62] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#4C3699] transition-all text-sm";

export default function PollDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading, isError } = usePoll(id);

  const [replyMsg, setReplyMsg] = useState("");
  const [replyPrice, setReplyPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleReply = async (e: FormEvent) => {
    e.preventDefault();
    if (!replyMsg.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/polls/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMsg.trim(), price: replyPrice || undefined }),
      });
      if (!res.ok) throw new Error("Failed");
      await queryClient.invalidateQueries({ queryKey: ["poll", id] });
      await queryClient.invalidateQueries({ queryKey: ["polls"] });
      toast("Reply sent successfully!", "success");
      setReplyMsg("");
      setReplyPrice("");
    } catch {
      toast("Failed to send reply.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = async () => {
    setClosing(true);
    try {
      await fetch(`/api/polls/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "closed" }),
      });
      await queryClient.invalidateQueries({ queryKey: ["poll", id] });
      await queryClient.invalidateQueries({ queryKey: ["polls"] });
      toast("Request marked as closed.", "info");
    } catch {
      toast("Failed to close request.", "error");
    } finally {
      setClosing(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#080912] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#C4B5FD] animate-spin" />
    </div>
  );

  if (isError || !data) return (
    <div className="min-h-screen bg-[#080912] flex items-center justify-center">
      <p className="text-[#5E5B82] font-medium">Request not found.</p>
    </div>
  );

  const { poll, replies } = data;
  const isOwner = poll.buyerId === CURRENT_USER_ID;
  const isOpen = poll.status === "open";

  return (
    <div className="min-h-screen bg-[#080912]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        <button onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[#5E5B82] hover:text-white mb-6 transition-colors group text-sm font-medium">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          All Requests
        </button>

        {/* Poll header card */}
        <div className="bg-[#13112A] border border-white/[0.08] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4">
          <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={clsx(
                "text-[11px] font-bold px-2.5 py-1 rounded-full border",
                isOpen
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-[#131425] text-[#7B78A0] border-white/[0.08]"
              )}>
                {isOpen ? "Open" : "Closed"}
              </span>
              <span className="text-[11px] font-semibold bg-[#2D1B69] text-[#A78BFA] border border-[#3D2785] px-2.5 py-1 rounded-full flex items-center gap-1">
                <Tag className="w-3 h-3" />{poll.category}
              </span>
            </div>
            {isOwner && isOpen && (
              <button onClick={handleClose} disabled={closing}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#5E5B82] hover:text-rose-600 border border-white/[0.08] hover:border-rose-200 px-3 py-1.5 rounded-xl transition-all disabled:opacity-50">
                <XCircle className="w-3.5 h-3.5" />
                {closing ? "Closing…" : "Mark as Closed"}
              </button>
            )}
          </div>

          <h1 className="text-xl font-extrabold text-white tracking-tight mb-2">{poll.itemName}</h1>
          <p className="text-sm text-[#7B78A0] leading-relaxed mb-4">{poll.description}</p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-[#7B78A0]">
              <img src={poll.buyerAvatar} alt={poll.buyerName} className="w-5 h-5 rounded-full" />
              <span className="font-semibold text-white">{poll.buyerName}</span>
            </div>
            <div className="flex items-center gap-1 text-[#5E5B82]">
              <MapPin className="w-3.5 h-3.5" />{poll.hostelId}
            </div>
            <div className="flex items-center gap-1 text-[#5E5B82]">
              <Clock className="w-3.5 h-3.5" />{timeAgo(poll.createdAt)}
            </div>
            {poll.maxPrice && (
              <div className="flex items-center gap-1 text-[#A78BFA] font-bold">
                <IndianRupee className="w-3.5 h-3.5" />Budget: up to ₹{poll.maxPrice.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Replies */}
        <div className="mb-4">
          <h2 className="text-sm font-bold text-[#5E5B82] uppercase tracking-widest mb-3 flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5" />
            {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
          </h2>

          {replies.length === 0 ? (
            <div className="bg-[#13112A] border border-white/[0.08] rounded-2xl p-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <MessageSquare className="w-8 h-8 text-[#2C2A52] mx-auto mb-2" />
              <p className="text-sm text-[#5E5B82]">No replies yet. Be the first seller to respond!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {replies.map(r => (
                <div key={r.id} className="bg-[#13112A] border border-white/[0.08] rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <img src={r.sellerAvatar} alt={r.sellerName} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="text-sm font-semibold text-white">{r.sellerName}</p>
                        <p className="text-xs text-[#5E5B82]">{timeAgo(r.createdAt)}</p>
                      </div>
                    </div>
                    {r.price && (
                      <span className="text-sm font-black text-[#A78BFA] bg-[#2D1B69] border border-[#3D2785] px-3 py-1 rounded-xl">
                        ₹{r.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#7B78A0] leading-relaxed">{r.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reply form */}
        {isOpen && !isOwner && (
          <div className="bg-[#13112A] border border-white/[0.08] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm font-bold text-white mb-4">Send a Reply</h3>
            <form onSubmit={handleReply} className="flex flex-col gap-3">
              <textarea
                value={replyMsg} onChange={e => setReplyMsg(e.target.value)}
                placeholder="Describe what you have and why it matches their request…"
                rows={3}
                className={inputCls + " resize-none"}
              />
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#3D3B62]" />
                  <input
                    value={replyPrice} onChange={e => setReplyPrice(e.target.value)}
                    type="number" placeholder="Your price (optional)"
                    className={inputCls + " pl-8"}
                  />
                </div>
                <button type="submit" disabled={submitting || !replyMsg.trim()}
                  className="flex items-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-[#3D2785] transition-all text-sm">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {submitting ? "Sending…" : "Reply"}
                </button>
              </div>
            </form>
          </div>
        )}

        {isOwner && isOpen && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            This is your request. Mark it as closed once you've found what you need.
          </div>
        )}

        {!isOpen && (
          <div className="mt-4 bg-[#131425] border border-white/[0.08] rounded-2xl p-4 text-sm text-[#5E5B82] flex items-center gap-2">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            This request has been closed. No more replies can be added.
          </div>
        )}
      </div>
    </div>
  );
}
