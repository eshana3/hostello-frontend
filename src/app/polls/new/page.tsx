"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import { useHostels } from "@/hooks/useHostels";
import { useToast } from "@/providers/ToastProvider";
import { ArrowLeft, Send, ClipboardList, Loader2 } from "lucide-react";
import clsx from "clsx";

export default function NewPollPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { categories } = useCategories();
  const { data: hostelGroups = [] } = useHostels();

  const [form, setForm] = useState({
    itemName: "", description: "", category: "", maxPrice: "", hostelId: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const field = (key: string) => ({
    name: key,
    value: (form as any)[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value })),
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.itemName.trim()) e.itemName = "Item name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.category) e.category = "Please select a category";
    if (!form.hostelId) e.hostelId = "Please select your hostel";
    if (form.maxPrice && isNaN(Number(form.maxPrice))) e.maxPrice = "Enter a valid number";
    return e;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      const poll = await res.json();
      toast("Request posted successfully!", "success");
      router.push(`/polls/${poll.id}`);
    } catch {
      toast("Failed to post request. Try again.", "error");
      setSubmitting(false);
    }
  };

  const inputCls = (key: string) => clsx(
    "w-full px-4 py-2.5 rounded-xl border text-sm text-white placeholder:text-[#3D3B62]",
    "focus:outline-none focus:ring-2 focus:ring-[#4C3699] transition-all bg-[#080912]",
    errors[key]
      ? "border-rose-300 bg-rose-50/30 focus:border-rose-400"
      : "border-white/[0.08] focus:border-[#7C3AED]"
  );

  return (
    <div className="min-h-screen bg-[#080912]">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">

        <button onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[#5E5B82] hover:text-white mb-6 transition-colors group text-sm font-medium">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#2D1B69] rounded-2xl flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-[#A78BFA]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Post a Request</h1>
            <p className="text-sm text-[#5E5B82]">Describe what you need and sellers will find you</p>
          </div>
        </div>

        <div className="bg-[#13112A] border border-white/[0.08] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            <div>
              <label className="block text-xs font-bold text-[#5E5B82] uppercase tracking-widest mb-2">
                Item Name <span className="text-rose-400">*</span>
              </label>
              <input {...field("itemName")} placeholder="e.g. Physics Textbook, Desk Lamp…" className={inputCls("itemName")} />
              {errors.itemName && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.itemName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5E5B82] uppercase tracking-widest mb-2">
                Description <span className="text-rose-400">*</span>
              </label>
              <textarea {...field("description")} rows={3}
                placeholder="Describe exactly what you need — condition preference, specific model, urgency…"
                className={clsx(inputCls("description"), "resize-none leading-relaxed")} />
              {errors.description && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5E5B82] uppercase tracking-widest mb-2">
                  Category <span className="text-rose-400">*</span>
                </label>
                <select {...field("category")} className={inputCls("category")}>
                  <option value="">Select…</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                {errors.category && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.category}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5E5B82] uppercase tracking-widest mb-2">
                  Max Budget (₹)
                </label>
                <input {...field("maxPrice")} type="number" placeholder="Optional" className={inputCls("maxPrice")} />
                {errors.maxPrice && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.maxPrice}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5E5B82] uppercase tracking-widest mb-2">
                Your Hostel <span className="text-rose-400">*</span>
              </label>
              <select {...field("hostelId")} className={inputCls("hostelId")}>
                <option value="">Select your hostel…</option>
                {hostelGroups.map((g: any) => (
                  <optgroup key={g.id} label={g.name}>
                    {(g.hostels ?? []).map((h: string) => <option key={h} value={h}>{h}</option>)}
                  </optgroup>
                ))}
              </select>
              {errors.hostelId && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.hostelId}</p>}
            </div>

            <button type="submit" disabled={submitting}
              className="flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-semibold py-3 rounded-xl shadow-sm shadow-[#3D2785] transition-all text-sm mt-1">
              {submitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting…</>
                : <><Send className="w-4 h-4" /> Post Request</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
