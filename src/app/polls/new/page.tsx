"use client";
import { useState, useEffect, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useCategories } from "@/hooks/useCategories";
import { useHostels } from "@/hooks/useHostels";
import { useToast } from "@/providers/ToastProvider";
import { ArrowLeft, Send, ClipboardList, Loader2 } from "lucide-react";
import clsx from "clsx";

function NewPollForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { toast } = useToast();
  const { categories } = useCategories();
  const { data: hostelGroups = [] } = useHostels();

  const [form, setForm] = useState({
    itemName: "", description: "", category: "", maxPrice: "", hostel: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingPoll, setLoadingPoll] = useState(!!editId);
  const [loadPollError, setLoadPollError] = useState<string | null>(null);

  useEffect(() => {
    if (!editId) return;
    let cancelled = false;
    setLoadingPoll(true);
    fetch(`/api/polls/${editId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load request");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const poll = data.poll;
        setForm({
          itemName: poll.itemName ?? "",
          description: poll.description ?? "",
          category: poll.category ?? "",
          maxPrice: poll.maxPrice ? String(poll.maxPrice) : "",
          hostel: poll.hostelId ?? "",
        });
      })
      .catch(() => {
        if (!cancelled) setLoadPollError("Couldn't load this request. It may have been removed.");
      })
      .finally(() => {
        if (!cancelled) setLoadingPoll(false);
      });
    return () => { cancelled = true; };
  }, [editId]);

  const field = (key: string) => ({
    name: key,
    value: (form as any)[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value })),
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.itemName.trim()) e.itemName = "Item name is required";
    if (!form.category) e.category = "Please select a category";
    if (!form.hostel) e.hostel = "Please select your hostel";
    if (form.maxPrice && isNaN(Number(form.maxPrice))) e.maxPrice = "Enter a valid number";
    return e;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const token = typeof window !== "undefined" ? localStorage.getItem("hm_auth_token") : null;
    if (!token) { toast("Please log in to post a request.", "error"); return; }

    setSubmitting(true);
    try {
      const res = await fetch(editId ? `/api/polls/${editId}` : "/api/polls", {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as any).message ?? "Failed");
      }

      if (editId) {
        await queryClient.invalidateQueries({ queryKey: ["poll", editId] });
        await queryClient.invalidateQueries({ queryKey: ["polls"] });
        toast("Request updated successfully!", "success");
        router.push(`/polls/${editId}`);
        return;
      }

      const poll = data.poll ?? data;
      toast("Request posted successfully!", "success");
      router.push(`/polls/${poll.id}`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to post request. Try again.", "error");
      setSubmitting(false);
    }
  };

  const inputCls = (key: string) => clsx(
    "w-full px-4 py-2.5 rounded-xl border text-sm text-white placeholder:text-[#6B7280]",
    "focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-all bg-[#0D0D1A]",
    errors[key]
      ? "border-rose-300 bg-rose-50/30 focus:border-rose-400"
      : "border-white/[0.08] focus:border-[#FF6B00]"
  );

  if (loadingPoll) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (loadPollError) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center px-4">
        <div className="bg-[#151521] border border-white/[0.08] rounded-3xl p-10 max-w-md w-full text-center shadow-[0_4px_32px_rgba(0,0,0,0.08)]">
          <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">Couldn&apos;t load request</h2>
          <p className="text-[#9CA3AF] text-sm mb-6 leading-relaxed">{loadPollError}</p>
          <button
            onClick={() => router.push("/polls")}
            className="w-full bg-[#FF6B00] hover:bg-[#E55A00] text-white py-2.5 rounded-xl font-semibold transition-colors text-sm shadow-sm">
            Browse Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">

        <button onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-white mb-6 transition-colors group text-sm font-medium">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#151521] rounded-2xl flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-[#FF8C00]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {editId ? "Edit Request" : "Post a Request"}
            </h1>
            <p className="text-sm text-[#9CA3AF]">
              {editId ? "Update the details of your request" : "Describe what you need and sellers will find you"}
            </p>
          </div>
        </div>

        <div className="bg-[#151521] border border-white/[0.08] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            <div>
              <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-2">
                Item Name <span className="text-rose-400">*</span>
              </label>
              <input {...field("itemName")} placeholder="e.g. Physics Textbook, Desk Lamp…" className={inputCls("itemName")} />
              {errors.itemName && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.itemName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-2">
                Description <span className="font-normal normal-case tracking-normal text-[#9CA3AF] text-[10px]">(optional)</span>
              </label>
              <textarea {...field("description")} rows={3}
                placeholder="Describe exactly what you need — condition preference, specific model, urgency…"
                className={clsx(inputCls("description"), "resize-none leading-relaxed")} />
              {errors.description && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-2">
                  Category <span className="text-rose-400">*</span>
                </label>
                <select {...field("category")} className={inputCls("category")}>
                  <option value="">Select…</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                {errors.category && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.category}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-2">
                  Max Budget (₹)
                </label>
                <input {...field("maxPrice")} type="number" placeholder="Optional" className={inputCls("maxPrice")} />
                {errors.maxPrice && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.maxPrice}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-2">
                Your Hostel <span className="text-rose-400">*</span>
              </label>
              <select {...field("hostel")} className={inputCls("hostel")}>
                <option value="">Select your hostel…</option>
                {hostelGroups.map((g: any) => (
                  <optgroup key={g.id} label={g.name}>
                    {(g.hostels ?? []).map((h: string) => <option key={h} value={h}>{h}</option>)}
                  </optgroup>
                ))}
              </select>
              {errors.hostel && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.hostel}</p>}
            </div>

            <button type="submit" disabled={submitting}
              className="flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] disabled:opacity-50 text-white font-semibold py-3 rounded-xl shadow-sm shadow-[#1E1E2E] transition-all text-sm mt-1">
              {submitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> {editId ? "Saving…" : "Posting…"}</>
                : <><Send className="w-4 h-4" /> {editId ? "Save Changes" : "Post Request"}</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function NewPollPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <NewPollForm />
    </Suspense>
  );
}
