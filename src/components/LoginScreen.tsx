"use client";
import { useState } from "react";
import { ShoppingBag, Phone, KeyRound, ArrowRight, Loader2, ChevronLeft, User, Home, RefreshCw } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

const HOSTELS = [
  ...Array.from({ length: 25 }, (_, i) => `KP-${i + 1}`),
  ...Array.from({ length: 13 }, (_, i) => `QC-${i + 1}`),
];

type Step = "phone" | "otp" | "profile";

export default function LoginScreen() {
  const { login } = useAuth();
  const [step, setStep]         = useState<Step>("phone");
  const [mobile, setMobile]     = useState("");
  const [otp, setOtp]           = useState("");
  const [otpError, setOtpError] = useState("");
  const [name, setName]         = useState("");
  const [hostel, setHostel]     = useState("");
  const [isNew, setIsNew]       = useState(false);
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // ── Step 1: Send real OTP via backend → Fast2SMS ──
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) return;
    setLoading(true);
    setApiError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || "Failed to send OTP. Please try again.");
        return;
      }

      setStep("otp");
      // Start 30s resend cooldown
      setResendCooldown(30);
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setApiError("Network error. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP with backend ──
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    setOtpError("");
    setApiError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.message || "Invalid OTP. Please try again.");
        return;
      }

      const { token, user: serverUser } = data;
      const newUser = !serverUser.name; // new user if no name saved yet

      if (newUser) {
        // Need to collect profile info
        setIsNew(true);
        // Store token temporarily for profile update call
        sessionStorage.setItem("pending_token", token);
        sessionStorage.setItem("pending_id", serverUser._id);
        setStep("profile");
      } else {
        // Existing user — log them in straight away
        login({
          _id: serverUser._id,
          mobile: serverUser.mobile,
          name: serverUser.name,
          role: "student",
          hostel: typeof serverUser.hostel === "object" ? serverUser.hostel?.name ?? "" : serverUser.hostel ?? "",
          token,
        });
      }
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Save profile (new users only) ──
  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !hostel) return;
    setLoading(true);
    setApiError("");

    try {
      const token = sessionStorage.getItem("pending_token") || "";
      const _id   = sessionStorage.getItem("pending_id")    || "";

      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim(), hostel }),
      });
      const data = await res.json();

      sessionStorage.removeItem("pending_token");
      sessionStorage.removeItem("pending_id");

      if (!res.ok) {
        setApiError(data.message || "Failed to save profile. Please try again.");
        return;
      }

      login({
        _id,
        mobile,
        name: name.trim(),
        role: "student",
        hostel,
        token,
      });
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = step === "phone" ? 0 : step === "otp" ? 1 : 2;

  return (
    <div className="min-h-screen bg-[#080912] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#7C3AED] text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight">Hostello</span>
          </div>
          <h2 className="text-3xl font-extrabold leading-snug tracking-tight mb-4">
            The campus<br />marketplace you<br />actually need.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Buy textbooks, sell gadgets, find clothes — all within your hostel. No apps, no shipping, no hassle.
          </p>
        </div>
        <div className="relative space-y-4">
          {[
            ["200+", "Active listings right now"],
            ["38",   "Hostels on campus"],
            ["Free", "Always free to use"],
          ].map(([val, label]) => (
            <div key={label} className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-white">{val}</span>
              <span className="text-sm text-white/40">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="w-8 h-8 bg-[#7C3AED] rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-lg text-white">Hostello</span>
        </div>

        <div className="w-full max-w-sm">
          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-8">
            {["Phone", "OTP", "Profile"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold transition-all ${
                  i < stepIndex ? "bg-[#7C3AED] text-white" :
                  i === stepIndex ? "bg-[#7C3AED] text-white" :
                  "bg-[#252248] text-[#5E5B82]"
                }`}>{i < stepIndex ? "✓" : i + 1}</div>
                <span className={`text-xs font-medium ${i === stepIndex ? "text-white" : "text-[#5E5B82]"}`}>{s}</span>
                {i < 2 && <div className="w-6 h-px bg-[#252248]" />}
              </div>
            ))}
          </div>

          {/* Global error */}
          {apiError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-rose-900/30 border border-rose-500/40 text-rose-400 text-sm">
              {apiError}
            </div>
          )}

          {/* ── STEP 1: Phone ── */}
          {step === "phone" && (
            <div>
              <div className="mb-6">
                <div className="w-10 h-10 bg-[#2D1B69] rounded-2xl flex items-center justify-center mb-4">
                  <Phone className="w-5 h-5 text-[#A78BFA]" />
                </div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight mb-1">Sign in</h1>
                <p className="text-sm text-[#5E5B82]">Enter your mobile number — we'll send you an OTP</p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="flex items-center gap-0 border border-white/[0.08] rounded-xl overflow-hidden focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#4C1D95] bg-[#1A1830] transition-all shadow-sm">
                  <span className="px-4 py-3 text-sm font-semibold text-[#5E5B82] border-r border-white/[0.08] bg-[#080912] shrink-0">+91</span>
                  <input
                    type="tel" maxLength={10} value={mobile} autoFocus
                    onChange={e => { setMobile(e.target.value.replace(/\D/g, "")); setApiError(""); }}
                    placeholder="10-digit mobile number"
                    className="flex-1 px-4 py-3 text-sm text-white placeholder-[#3D3B62] bg-transparent focus:outline-none"
                  />
                </div>
                <button type="submit" disabled={mobile.length !== 10 || loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-sm">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Send OTP</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </div>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === "otp" && (
            <div>
              <button onClick={() => { setStep("phone"); setOtp(""); setOtpError(""); setApiError(""); }}
                className="flex items-center gap-1 text-xs text-[#5E5B82] hover:text-[#B5B2D8] mb-6 transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" /> +91 {mobile}
              </button>

              <div className="mb-6">
                <div className="w-10 h-10 bg-[#2D1B69] rounded-2xl flex items-center justify-center mb-4">
                  <KeyRound className="w-5 h-5 text-[#A78BFA]" />
                </div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight mb-1">Enter OTP</h1>
                <p className="text-sm text-[#5E5B82]">6-digit code sent to +91 {mobile}</p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <input
                  type="tel" maxLength={6} value={otp} autoFocus
                  onChange={e => { setOtp(e.target.value.replace(/\D/g, "")); setOtpError(""); }}
                  placeholder="• • • • • •"
                  className="w-full text-center text-3xl font-black tracking-[0.5em] border border-white/[0.08] rounded-xl py-4 bg-[#1A1830] text-white placeholder-[#252248] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#4C3699] transition-all shadow-sm"
                />
                {otpError && <p className="text-xs text-rose-400 text-center font-medium">{otpError}</p>}

                <button type="submit" disabled={otp.length !== 6 || loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-sm">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Verify OTP</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              {/* Resend */}
              <div className="text-center mt-5">
                {resendCooldown > 0 ? (
                  <p className="text-xs text-[#3D3B62]">Resend OTP in <span className="text-[#A78BFA] font-semibold">{resendCooldown}s</span></p>
                ) : (
                  <button onClick={handleSendOtp as any}
                    className="flex items-center gap-1.5 mx-auto text-xs text-[#7B78A0] hover:text-[#A78BFA] transition-colors">
                    <RefreshCw className="w-3 h-3" /> Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 3: Profile (new users only) ── */}
          {step === "profile" && (
            <div>
              <div className="mb-6">
                <div className="w-10 h-10 bg-[#2D1B69] rounded-2xl flex items-center justify-center mb-4">
                  <User className="w-5 h-5 text-[#A78BFA]" />
                </div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight mb-1">Your profile</h1>
                <p className="text-sm text-[#5E5B82]">Just two things to get you started</p>
              </div>

              <form onSubmit={handleProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#7B78A0] mb-1.5">Your name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3D3B62]" />
                    <input value={name} onChange={e => setName(e.target.value)} required autoFocus
                      placeholder="e.g. Eshana Singh"
                      className="w-full pl-10 pr-4 py-3 border border-white/[0.08] rounded-xl bg-[#1A1830] text-sm text-white placeholder-[#3D3B62] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#4C3699] transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#7B78A0] mb-1.5">Your hostel</label>
                  <div className="relative">
                    <Home className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3D3B62] pointer-events-none" />
                    <select value={hostel} onChange={e => setHostel(e.target.value)} required
                      className="w-full pl-10 pr-4 py-3 border border-white/[0.08] rounded-xl bg-[#1A1830] text-sm text-white focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#4C3699] transition-all shadow-sm appearance-none">
                      <option value="">Select your hostel</option>
                      {HOSTELS.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={!name.trim() || !hostel || loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-sm">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Start Exploring</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
