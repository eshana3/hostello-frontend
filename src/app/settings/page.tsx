"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, getAuthToken } from "@/providers/AuthProvider";
import { ArrowLeft, User, Mail, MapPin, LogOut, Trash2, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const hostelName = typeof user?.hostel === "object" ? (user?.hostel as any)?.name : user?.hostel;

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const token = getAuthToken();
      await fetch("/api/auth/account", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } finally {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        <button onClick={() => router.back()}
          className="flex items-center gap-1.5 text-white/40 hover:text-white mb-6 transition-colors group text-sm font-medium">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        <h1 className="text-2xl font-extrabold text-white tracking-tight mb-6">Settings</h1>

        {/* Account info */}
        <div className="bg-[#151521] border border-white/[0.08] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Account</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-[#FFD4A0] shrink-0" />
              <span className="text-white/50">Name</span>
              <span className="ml-auto font-medium text-white truncate">{user?.name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-[#FFD4A0] shrink-0" />
              <span className="text-white/50">Email</span>
              <span className="ml-auto font-medium text-white truncate">{user?.email ?? "—"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-[#FFD4A0] shrink-0" />
              <span className="text-white/50">Hostel</span>
              <span className="ml-auto font-medium text-white truncate">{hostelName ?? "—"}</span>
            </div>
          </div>
        </div>

        {/* Session */}
        <div className="bg-[#151521] border border-white/[0.08] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mt-4">
          <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Session</h2>
          <button
            onClick={logout}
            className="flex items-center gap-2.5 w-full px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>

        {/* Danger zone */}
        <div className="bg-[#151521] border border-rose-900/40 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mt-4">
          <h2 className="flex items-center gap-1.5 text-xs font-bold text-rose-400/80 uppercase tracking-widest mb-4">
            <AlertTriangle className="w-3.5 h-3.5" /> Danger Zone
          </h2>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2.5 w-full px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors active:scale-[0.98]"
            >
              <Trash2 className="w-4 h-4" /> Delete account
            </button>
          ) : (
            <div>
              <p className="text-sm text-white/50 mb-3">
                This will permanently delete your account, listings, and messages. This cannot be undone.
              </p>
              <div className="flex gap-2.5">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
                >
                  {deleting ? "Deleting…" : "Yes, delete my account"}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
