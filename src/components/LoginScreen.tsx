"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Mail, Lock, User, Eye, EyeOff,
  ArrowRight, Loader2, CheckCircle2, Home, Send,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { QC_HOSTELS, KP_HOSTELS } from "@/lib/hostelUtils";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (cfg: {
            client_id: string;
            callback: (r: { credential: string }) => void;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          prompt: () => void;
          renderButton: (
            parent: HTMLElement,
            options: { theme?: string; size?: string; type?: string; width?: string | number }
          ) => void;
        };
      };
    };
  }
}

const BEZIER: [number, number, number, number] = [0.22, 1, 0.36, 1];

const GLOWS = [
  { left: "-8%",  top: "-12%", w: 760, h: 760, color: "rgba(255,122,24,0.17)",  dur: 32, delay: 0, dx: [0, 72, -44, 0], dy: [0, 52, -32, 0], sc: [1, 1.13, 0.91, 1] },
  { left: "72%",  top: "-10%", w: 680, h: 680, color: "rgba(124,58,237,0.15)",  dur: 42, delay: 8, dx: [0, -62, 38, 0], dy: [0, 56, -28, 0], sc: [1, 1.11, 0.93, 1] },
  { left: "-5%",  top: "68%",  w: 600, h: 600, color: "rgba(56,189,248,0.11)",  dur: 28, delay: 5, dx: [0, 52, -32, 0], dy: [0, -46, 24, 0], sc: [1, 1.15, 0.90, 1] },
];

function passwordStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length === 0) return { label: "",          color: "",        width: "0%"   };
  if (pw.length < 6)   return { label: "Too short", color: "#EF4444", width: "25%"  };
  if (pw.length < 8)   return { label: "Weak",      color: "#F97316", width: "50%"  };
  if (pw.length < 12)  return { label: "Good",      color: "#FBBF24", width: "75%"  };
  return                      { label: "Strong",    color: "#10B981", width: "100%" };
}

function GlassInput({
  label, icon: Icon, type = "text", value, onChange, onBlur, placeholder,
  autoComplete, autoFocus, error, rightSlot,
}: {
  label?: string;
  icon: React.ElementType;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  error?: string;
  rightSlot?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && (
        <label
          className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-2"
          style={{ color: "rgba(255,255,255,0.38)" }}
        >
          {label}
        </label>
      )}
      <div
        className="relative"
        style={{
          background: focused ? "rgba(16,20,48,0.95)" : "rgba(10,13,32,0.82)",
          border: `1px solid ${
            error   ? "rgba(239,68,68,0.60)"  :
            focused ? "rgba(99,102,241,0.60)" :
                      "rgba(255,255,255,0.12)"
          }`,
          borderRadius: 14,
          boxShadow: focused
            ? "0 0 0 3px rgba(99,102,241,0.10), 0 2px 20px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "0 1px 6px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.04)",
          transition: "all 0.22s ease",
        }}
      >
        <Icon
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: 15, height: 15,
            color: focused ? "rgba(129,140,248,0.85)" : "rgba(255,255,255,0.30)",
            transition: "color 0.22s ease",
          }}
        />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlur?.(); }}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className="w-full placeholder-white/20 focus:outline-none"
          style={{
            paddingLeft: 44,
            paddingRight: rightSlot ? 46 : 16,
            paddingTop: 14,
            paddingBottom: 14,
            background: "transparent",
            color: "rgba(255,255,255,0.95)",
            fontSize: 14,
            letterSpacing: "0.01em",
          }}
        />
        {rightSlot && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <p className="text-[12px] mt-1.5" style={{ color: "#FC8181", letterSpacing: "0.01em" }}>{error}</p>
      )}
    </div>
  );
}

function HostelSelect({
  value, onChange, error,
}: {
  value: string; onChange: (v: string) => void; error: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-2"
        style={{ color: "rgba(255,255,255,0.38)" }}
      >
        Your hostel
      </label>
      <div
        className="relative"
        style={{
          background: focused ? "rgba(16,20,48,0.95)" : "rgba(10,13,32,0.82)",
          border: `1px solid ${
            error   ? "rgba(239,68,68,0.60)"  :
            focused ? "rgba(99,102,241,0.60)" :
                      "rgba(255,255,255,0.12)"
          }`,
          borderRadius: 14,
          boxShadow: focused
            ? "0 0 0 3px rgba(99,102,241,0.10), 0 2px 20px rgba(0,0,0,0.30)"
            : "0 1px 6px rgba(0,0,0,0.22)",
          transition: "all 0.22s ease",
        }}
      >
        <Home
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: 15, height: 15,
            color: focused ? "rgba(129,140,248,0.85)" : "rgba(255,255,255,0.30)",
            transition: "color 0.22s ease",
          }}
        />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full pl-11 pr-4 appearance-none focus:outline-none"
          style={{
            paddingTop: 14,
            paddingBottom: 14,
            background: "transparent",
            color: value ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.25)",
            fontSize: 14,
            letterSpacing: "0.01em",
          }}
        >
          <option value="" style={{ background: "#0B1020", color: "rgba(255,255,255,0.40)" }}>
            Select your hostel
          </option>
          <optgroup label="QC Hostels (Girls)" style={{ background: "#0B1020" }}>
            {QC_HOSTELS.map(h => (
              <option key={h} value={h} style={{ background: "#0B1020", color: "white" }}>{h}</option>
            ))}
          </optgroup>
          <optgroup label="KP Hostels (Girls)" style={{ background: "#0B1020" }}>
            {KP_HOSTELS.map(h => (
              <option key={h} value={h} style={{ background: "#0B1020", color: "white" }}>{h}</option>
            ))}
          </optgroup>
        </select>
      </div>
      {error && (
        <p className="text-[12px] mt-1.5" style={{ color: "#FC8181", letterSpacing: "0.01em" }}>{error}</p>
      )}
    </div>
  );
}

export default function LoginScreen() {
  const { login: authLogin } = useAuth();

  const [tab, setTab]               = useState<"login" | "register">("login");
  const [flipDirection, setFlipDirection] = useState(1);

  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [name, setName]             = useState("");
  const [hostel, setHostel]         = useState("");

  const [forgotMode, setForgotMode]         = useState(false);
  const [forgotEmail, setForgotEmail]       = useState("");
  const [forgotEmailErr, setForgotEmailErr] = useState("");
  const [forgotLoading, setForgotLoading]   = useState(false);
  const [forgotSent, setForgotSent]         = useState(false);

  const [profileStep, setProfileStep]       = useState(false);
  const [pendingUser, setPendingUser]       = useState<{ token: string; user: any } | null>(null);
  const [setupHostel, setSetupHostel]       = useState("");
  const [setupHostelErr, setSetupHostelErr] = useState("");
  const [setupLoading, setSetupLoading]     = useState(false);

  const [loading, setLoading]               = useState(false);
  const [googleLoading, setGoogleLoading]   = useState(false);
  const [apiError, setApiError]             = useState("");
  const [successMsg, setSuccessMsg]         = useState("");
  const [googleHint, setGoogleHint]         = useState(false);
  const [successFlip, setSuccessFlip]       = useState(false);

  const [emailErr, setEmailErr]   = useState("");
  const [passErr, setPassErr]     = useState("");
  const [nameErr, setNameErr]     = useState("");
  const [hostelErr, setHostelErr] = useState("");

  const strength = passwordStrength(password);

  const switchTab = (t: "login" | "register") => {
    setFlipDirection(t === "register" ? 1 : -1);
    setTab(t);
    setApiError(""); setSuccessMsg(""); setGoogleHint(false);
    setEmailErr(""); setPassErr(""); setNameErr(""); setHostelErr("");
    setEmail(""); setPassword(""); setName(""); setHostel("");
  };

  const validateEmail = (v: string) => {
    if (!v) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address";
    return "";
  };
  const validatePassword = (v: string) => {
    if (!v) return "Password is required";
    if (v.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const googleCallbackRef = useRef<(credential: string) => void>(() => {});
  const googleBtnRef      = useRef<HTMLDivElement>(null);

  const handleGoogleCredential = useCallback(async (credential: string) => {
    setGoogleLoading(true);
    setApiError(""); setGoogleHint(false);
    try {
      const res  = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credential }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.isNewUser) {
          setPendingUser({ token: data.token, user: data.user });
          setSetupHostel(""); setSetupHostelErr(""); setApiError("");
          setProfileStep(true);
        } else {
          setSuccessFlip(true);
          setTimeout(() => authLogin({ ...data.user, token: data.token }), 700);
        }
      } else {
        setApiError(data.message || "Google sign-in failed. Please try again.");
      }
    } catch {
      setApiError("Google sign-in failed. Please check your connection.");
    } finally {
      setGoogleLoading(false);
    }
  }, [authLogin]);

  useEffect(() => { googleCallbackRef.current = handleGoogleCredential; }, [handleGoogleCredential]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;
    const init = () => {
      if (!googleBtnRef.current) return;
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: (r) => googleCallbackRef.current(r.credential),
        use_fedcm_for_prompt: false,
      });
      window.google?.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline", size: "large", type: "standard", width: "400",
      });
    };
    if (window.google?.accounts) { init(); return; }
    const script = document.createElement("script");
    script.src    = "https://accounts.google.com/gsi/client";
    script.async  = true;
    script.defer  = true;
    script.onload = init;
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  const handleGoogleClick = () => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      setApiError("Google sign-in is not configured.");
      return;
    }
    const inner = googleBtnRef.current?.querySelector<HTMLElement>("div[role=button], button");
    if (inner) {
      inner.click();
    } else {
      setApiError("Google sign-in is loading, please try again in a moment.");
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupHostel) { setSetupHostelErr("Please select your hostel"); return; }
    setSetupLoading(true); setApiError("");
    try {
      const res  = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${pendingUser!.token}`,
        },
        body: JSON.stringify({ name: pendingUser!.user.name, hostel: setupHostel }),
      });
      const data = await res.json();
      if (!data.success) { setApiError(data.message || "Failed to save hostel."); return; }
      setSuccessFlip(true);
      setTimeout(() => authLogin({ ...data.user, token: pendingUser!.token }), 700);
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setSetupLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(forgotEmail);
    setForgotEmailErr(err);
    if (err) return;
    setForgotLoading(true); setApiError("");
    try {
      const res  = await fetch("/api/auth/magic-link/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) { setApiError(data.message || "Failed to send login link."); return; }
      setForgotSent(true);
    } catch {
      setApiError("Network error. Make sure the server is running.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailErr(eErr); setPassErr(pErr);
    if (eErr || pErr) return;
    setLoading(true); setApiError(""); setGoogleHint(false);
    try {
      const res  = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg: string = data.message || "Login failed. Please try again.";
        if (msg.toLowerCase().includes("google")) {
          setGoogleHint(true);
        } else {
          setApiError(msg);
        }
        return;
      }
      setSuccessFlip(true);
      setTimeout(() => authLogin({ ...data.user, token: data.token }), 700);
    } catch {
      setApiError("Network error. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const nErr = !name.trim() ? "Name is required" : "";
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    const hErr = !hostel ? "Please select your hostel" : "";
    setNameErr(nErr); setEmailErr(eErr); setPassErr(pErr); setHostelErr(hErr);
    if (nErr || eErr || pErr || hErr) return;
    setLoading(true); setApiError(""); setSuccessMsg("");
    try {
      const res  = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          hostelName: hostel,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg: string = data.message || "Registration failed. Please try again.";
        if (msg.toLowerCase().includes("already exists")) {
          setApiError("already-exists");
        } else {
          setApiError(msg);
        }
        return;
      }
      setSuccessFlip(true);
      setTimeout(() => authLogin({ ...data.user, token: data.token }), 700);
    } catch {
      setApiError("Network error. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden"
      style={{ background: "#060810" }}
    >
      {/* Ambient glow sources */}
      {GLOWS.map((g, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: g.left, top: g.top,
            width: g.w, height: g.h,
            background: g.color,
            filter: "blur(108px)",
            transform: "translate(-50%, -50%)",
            willChange: "transform",
          }}
          animate={{ x: g.dx, y: g.dy, scale: g.sc }}
          transition={{ duration: g.dur, delay: g.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Central depth glow */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          left: "50%", top: "46%",
          width: 520, height: 420,
          background: "rgba(79,70,229,0.07)",
          filter: "blur(90px)",
          transform: "translate(-50%, -50%)",
          willChange: "transform",
        }}
        animate={{ x: [0, 38, -24, 12, 0], y: [0, -30, 20, -10, 0], scale: [1, 1.18, 0.88, 1.06, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.022,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "160px",
          zIndex: 0,
        }}
      />

      {/* ── Content ── */}
      <div className="relative flex flex-col items-center w-full" style={{ zIndex: 1 }}>

        {/* Logo mark */}
        <motion.div
          className="flex items-center gap-3 mb-9"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: BEZIER }}
        >
          {/* Icon with soft aura */}
          <div className="relative">
            <div
              className="absolute pointer-events-none"
              style={{
                inset: -8, borderRadius: 20,
                background: "rgba(255,122,24,0.22)",
                filter: "blur(14px)",
              }}
            />
            <motion.div
              className="relative w-10 h-10 flex items-center justify-center overflow-hidden"
              style={{
                borderRadius: 12,
                background: "linear-gradient(150deg, #FFB84D 0%, #FF8520 50%, #E06000 100%)",
                boxShadow: [
                  "inset 0 1px 0 rgba(255,255,255,0.30)",
                  "inset 0 -1px 0 rgba(0,0,0,0.20)",
                  "0 6px 24px rgba(224,96,0,0.55)",
                  "0 2px 6px rgba(0,0,0,0.35)",
                ].join(", "),
              }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.07 }}
            >
              <div
                className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
                style={{ borderRadius: "12px 12px 0 0", background: "linear-gradient(180deg, rgba(255,255,255,0.26) 0%, transparent 100%)" }}
              />
              <ShoppingBag
                className="relative z-10"
                style={{ width: 19, height: 19, color: "white", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.28))" }}
              />
            </motion.div>
          </div>

          {/* Brand text */}
          <div>
            <p className="font-black text-white leading-none" style={{ fontSize: 18, letterSpacing: "-0.3px" }}>
              Hostel Mart
            </p>
            <p className="mt-0.5" style={{ fontSize: 11, color: "rgba(255,155,61,0.65)", letterSpacing: "0.07em", fontWeight: 500 }}>
              CAMPUS MARKETPLACE
            </p>
          </div>
        </motion.div>

        {/* Card wrapper */}
        <div className="relative w-full" style={{ maxWidth: 432 }}>

          {/* Behind-card halo */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "145%", height: "145%",
              background: "radial-gradient(ellipse at center, rgba(79,70,229,0.18) 0%, rgba(124,58,237,0.10) 38%, transparent 66%)",
              filter: "blur(60px)",
              zIndex: 0,
            }}
          />

          {/* Card entry animation */}
          <motion.div
            className="relative"
            style={{ zIndex: 1 }}
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.60, ease: BEZIER, delay: 0.1 }}
          >
            <motion.div
              animate={successFlip ? { opacity: 0, scale: 0.96 } : { opacity: 1, scale: 1 }}
              transition={successFlip ? { duration: 0.35, ease: "easeInOut" } : {}}
            >
              {/* Glass card */}
              <div
                className="relative rounded-[28px] overflow-hidden"
                style={{
                  background: "rgba(9,12,28,0.93)",
                  backdropFilter: "blur(44px) saturate(200%)",
                  WebkitBackdropFilter: "blur(44px) saturate(200%)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: [
                    "0 40px 100px rgba(0,0,0,0.65)",
                    "0 12px 40px rgba(0,0,0,0.40)",
                    "0 0 0 1px rgba(255,255,255,0.03)",
                    "inset 0 1px 0 rgba(255,255,255,0.08)",
                  ].join(", "),
                }}
              >
                {/* Top edge highlight */}
                <div
                  className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent 8%, rgba(255,255,255,0.26) 50%, transparent 92%)" }}
                />

                {/* Subtle inner ambient — top-centre indigo wash */}
                <div
                  className="absolute inset-x-0 top-0 pointer-events-none"
                  style={{
                    height: 140,
                    background: "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(99,102,241,0.07) 0%, transparent 100%)",
                  }}
                />

                <div className="relative p-8 sm:p-9" style={{ zIndex: 1 }}>
                  <AnimatePresence mode="wait">

                    {/* ── PROFILE STEP ── */}
                    {profileStep && (
                      <motion.div
                        key="profile"
                        initial={{ opacity: 0, x: 28 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -28 }}
                        transition={{ duration: 0.32, ease: BEZIER }}
                      >
                        {(pendingUser?.user?.avatar || pendingUser?.user?.name) && (
                          <div className="flex items-center gap-3 mb-6">
                            {pendingUser.user.avatar && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={pendingUser.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10" />
                            )}
                            <div>
                              <p className="text-white font-semibold text-sm">{pendingUser.user.name}</p>
                              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.38)" }}>{pendingUser.user.email}</p>
                            </div>
                          </div>
                        )}
                        <h3 className="text-white font-bold mb-1.5" style={{ fontSize: 22, letterSpacing: "-0.3px" }}>One last thing</h3>
                        <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>
                          Which hostel are you in? We&apos;ll use this to show you nearby listings.
                        </p>
                        {apiError && (
                          <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "#FC8181" }}>
                            {apiError}
                          </div>
                        )}
                        <form onSubmit={handleCompleteProfile} className="space-y-5" noValidate>
                          <HostelSelect
                            value={setupHostel}
                            onChange={(v) => { setSetupHostel(v); setSetupHostelErr(""); }}
                            error={setupHostelErr}
                          />
                          <PrimaryButton loading={setupLoading} label="Get started" />
                        </form>
                      </motion.div>
                    )}

                    {/* ── FORGOT PASSWORD ── */}
                    {!profileStep && forgotMode && (
                      <motion.div
                        key="forgot"
                        initial={{ opacity: 0, x: 36 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -36 }}
                        transition={{ duration: 0.30 }}
                      >
                        <button
                          type="button"
                          onClick={() => { setForgotMode(false); setForgotSent(false); setForgotEmail(""); setForgotEmailErr(""); setApiError(""); }}
                          className="flex items-center gap-1.5 text-xs mb-6 transition-colors"
                          style={{ color: "rgba(255,255,255,0.35)" }}
                          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.70)")}
                          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)")}
                        >
                          <ArrowRight className="w-3 h-3 rotate-180" /> Back to login
                        </button>
                        <h3 className="text-white font-bold mb-1.5" style={{ fontSize: 22, letterSpacing: "-0.3px" }}>Reset password</h3>
                        <p className="text-[13.5px] mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>
                          Enter your email and we&apos;ll send a one-click login link — no password needed.
                        </p>
                        {apiError && (
                          <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "#FC8181" }}>
                            {apiError}
                          </div>
                        )}
                        {forgotSent ? (
                          <motion.div
                            className="px-4 py-4 rounded-xl text-sm flex items-start gap-3"
                            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.22)", color: "#34D399" }}
                            initial={{ scale: 0.93, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 280, damping: 20 }}
                          >
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>
                              Login link sent to <strong>{forgotEmail}</strong>. Expires in 15 min.
                              <span className="block mt-1 text-xs" style={{ color: "rgba(255,255,255,0.32)" }}>
                                Running locally? Check the server terminal.
                              </span>
                            </span>
                          </motion.div>
                        ) : (
                          <form onSubmit={handleForgotPassword} className="space-y-4" noValidate>
                            <GlassInput
                              label="Email address"
                              icon={Mail}
                              type="email"
                              value={forgotEmail}
                              onChange={(v) => { setForgotEmail(v); setForgotEmailErr(""); setApiError(""); }}
                              onBlur={() => setForgotEmailErr(validateEmail(forgotEmail))}
                              placeholder="you@example.com"
                              autoComplete="email"
                              autoFocus
                              error={forgotEmailErr}
                            />
                            <PrimaryButton loading={forgotLoading} icon={<Send className="w-4 h-4" />} label="Send login link" />
                          </form>
                        )}
                      </motion.div>
                    )}

                    {/* ── MAIN ── */}
                    {!profileStep && !forgotMode && (
                      <motion.div
                        key="main"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.40, ease: BEZIER }}
                      >
                        {/* Heading */}
                        <div className="mb-7">
                          <h2 className="font-bold text-white leading-tight" style={{ fontSize: 27, letterSpacing: "-0.5px" }}>
                            {tab === "login" ? "Welcome back" : "Create account"}
                          </h2>
                          <p className="mt-1.5" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.40)", lineHeight: 1.5 }}>
                            {tab === "login"
                              ? "Sign in to your Hostel Mart account"
                              : "Join your campus marketplace today"}
                          </p>
                        </div>

                        {/* Tab switcher */}
                        <div
                          className="flex relative mb-7 rounded-2xl"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            padding: 5,
                          }}
                        >
                          <motion.div
                            className="absolute rounded-[14px]"
                            style={{
                              top: 5, bottom: 5,
                              width: "calc(50% - 5px)",
                              background: "linear-gradient(135deg, rgba(99,102,241,0.60) 0%, rgba(129,140,248,0.48) 100%)",
                              boxShadow: "0 2px 14px rgba(99,102,241,0.28), inset 0 1px 0 rgba(255,255,255,0.12)",
                              border: "1px solid rgba(129,140,248,0.22)",
                            }}
                            initial={false}
                            animate={{ x: tab === "login" ? 5 : "calc(100% + 5px)" }}
                            transition={{ type: "spring", stiffness: 420, damping: 38 }}
                          />
                          {(["login", "register"] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => switchTab(t)}
                              className="flex-1 py-2 text-[13px] font-semibold rounded-[14px] relative z-10 transition-colors duration-200"
                              style={{ color: tab === t ? "white" : "rgba(255,255,255,0.34)", letterSpacing: "0.01em" }}
                            >
                              {t === "login" ? "Log in" : "Sign up"}
                            </button>
                          ))}
                        </div>

                        {/* Banners */}
                        <AnimatePresence>
                          {apiError === "already-exists" && (
                            <motion.div
                              className="mb-5 px-4 py-3 rounded-xl text-sm"
                              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "#FC8181" }}
                              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            >
                              An account with this email already exists.{" "}
                              <button type="button" onClick={() => switchTab("login")} className="underline font-semibold hover:text-white transition-colors">
                                Log in instead
                              </button>
                            </motion.div>
                          )}
                          {apiError && apiError !== "already-exists" && (
                            <motion.div
                              className="mb-5 px-4 py-3 rounded-xl text-sm"
                              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "#FC8181" }}
                              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            >
                              {apiError}
                            </motion.div>
                          )}
                          {successMsg && (
                            <motion.div
                              className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.22)", color: "#34D399" }}
                              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            >
                              <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMsg}
                            </motion.div>
                          )}
                          {googleHint && (
                            <motion.div
                              className="mb-5 px-4 py-3 rounded-xl text-sm"
                              style={{ background: "rgba(255,122,24,0.07)", border: "1px solid rgba(255,122,24,0.22)", color: "#FFD4A0" }}
                              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            >
                              This account was created with Google. Use the button below to sign in.
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Google button */}
                        <motion.button
                          type="button"
                          onClick={handleGoogleClick}
                          disabled={googleLoading}
                          className="w-full flex items-center justify-center gap-3 font-medium text-white disabled:opacity-50 mb-5 rounded-2xl"
                          style={{
                            fontSize: 13.5,
                            paddingTop: 13,
                            paddingBottom: 13,
                            background: googleHint ? "rgba(255,122,24,0.08)" : "rgba(255,255,255,0.06)",
                            border: googleHint ? "1px solid rgba(255,122,24,0.38)" : "1px solid rgba(255,255,255,0.12)",
                            boxShadow: googleHint
                              ? "0 0 0 3px rgba(255,122,24,0.10)"
                              : "0 1px 4px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.04)",
                            letterSpacing: "0.01em",
                            transition: "all 0.20s ease",
                          }}
                          whileHover={{ scale: 1.012 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          onMouseEnter={e => { if (!googleHint) { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.09)"; el.style.borderColor = "rgba(255,255,255,0.16)"; } }}
                          onMouseLeave={e => { if (!googleHint) { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.06)"; el.style.borderColor = "rgba(255,255,255,0.12)"; } }}
                        >
                          {googleLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                          )}
                          Continue with Google
                        </motion.button>

                        {/* Hidden GSI trigger */}
                        <div ref={googleBtnRef} aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: 0, width: "400px" }} />

                        {/* Divider */}
                        <div className="flex items-center gap-3 mb-5">
                          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                          <span style={{ fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.18)", letterSpacing: "0.12em", textTransform: "uppercase" }}>or</span>
                          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                        </div>

                        {/* Forms */}
                        <AnimatePresence mode="wait" custom={flipDirection}>
                          {tab === "login" && (
                            <motion.form
                              key="login-form"
                              custom={flipDirection}
                              onSubmit={handleLogin}
                              className="space-y-4"
                              noValidate
                              initial={{ opacity: 0, x: -16 * flipDirection }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 16 * flipDirection }}
                              transition={{ duration: 0.26, ease: BEZIER }}
                            >
                              <GlassInput
                                label="Email address"
                                icon={Mail}
                                type="email"
                                value={email}
                                onChange={(v) => { setEmail(v); setEmailErr(""); setApiError(""); setGoogleHint(false); }}
                                onBlur={() => setEmailErr(validateEmail(email))}
                                placeholder="you@example.com"
                                autoComplete="email"
                                autoFocus
                                error={emailErr}
                              />

                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.38)" }}>
                                    Password
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => { setForgotMode(true); setForgotEmail(email); setApiError(""); }}
                                    style={{ fontSize: 11.5, fontWeight: 500, color: "rgba(255,140,40,0.80)", transition: "color 0.15s" }}
                                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#FF9B3D")}
                                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,140,40,0.80)")}
                                  >
                                    Forgot password?
                                  </button>
                                </div>
                                <GlassInput
                                  icon={Lock}
                                  type={showPass ? "text" : "password"}
                                  value={password}
                                  onChange={(v) => { setPassword(v); setPassErr(""); setApiError(""); }}
                                  onBlur={() => setPassErr(validatePassword(password))}
                                  placeholder="Your password"
                                  autoComplete="current-password"
                                  error={passErr}
                                  rightSlot={<EyeToggle show={showPass} onToggle={() => setShowPass(v => !v)} />}
                                />
                              </div>

                              <PrimaryButton loading={loading} label="Log in" icon={<ArrowRight className="w-4 h-4" />} className="mt-2" />

                              <p className="text-center pt-0.5" style={{ fontSize: 12.5, color: "rgba(255,255,255,0.30)" }}>
                                Don&apos;t have an account?{" "}
                                <button
                                  type="button"
                                  onClick={() => switchTab("register")}
                                  style={{ fontWeight: 600, color: "rgba(255,155,61,0.85)", transition: "color 0.15s" }}
                                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#FF9B3D")}
                                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,155,61,0.85)")}
                                >
                                  Sign up
                                </button>
                              </p>
                            </motion.form>
                          )}

                          {tab === "register" && (
                            <motion.form
                              key="register-form"
                              custom={flipDirection}
                              onSubmit={handleRegister}
                              className="space-y-4"
                              noValidate
                              initial={{ opacity: 0, x: -16 * flipDirection }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 16 * flipDirection }}
                              transition={{ duration: 0.26, ease: BEZIER }}
                            >
                              <GlassInput
                                label="Full name"
                                icon={User}
                                type="text"
                                value={name}
                                onChange={(v) => { setName(v); setNameErr(""); setApiError(""); }}
                                onBlur={() => setNameErr(!name.trim() ? "Name is required" : "")}
                                placeholder="Your full name"
                                autoComplete="name"
                                autoFocus
                                error={nameErr}
                              />

                              <HostelSelect
                                value={hostel}
                                onChange={(v) => { setHostel(v); setHostelErr(""); setApiError(""); }}
                                error={hostelErr}
                              />

                              <GlassInput
                                label="Email address"
                                icon={Mail}
                                type="email"
                                value={email}
                                onChange={(v) => { setEmail(v); setEmailErr(""); setApiError(""); }}
                                onBlur={() => setEmailErr(validateEmail(email))}
                                placeholder="you@example.com"
                                autoComplete="email"
                                error={emailErr}
                              />

                              <div>
                                <GlassInput
                                  label="Password"
                                  icon={Lock}
                                  type={showPass ? "text" : "password"}
                                  value={password}
                                  onChange={(v) => { setPassword(v); setPassErr(""); setApiError(""); }}
                                  onBlur={() => setPassErr(validatePassword(password))}
                                  placeholder="Min. 6 characters"
                                  autoComplete="new-password"
                                  error={passErr}
                                  rightSlot={<EyeToggle show={showPass} onToggle={() => setShowPass(v => !v)} />}
                                />
                                {password.length > 0 && (
                                  <div className="mt-2.5">
                                    <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                                      <motion.div
                                        className="h-full rounded-full"
                                        style={{ background: strength.color }}
                                        initial={{ width: "0%" }}
                                        animate={{ width: strength.width }}
                                        transition={{ duration: 0.35 }}
                                      />
                                    </div>
                                    <p className="mt-1" style={{ fontSize: 11.5, fontWeight: 500, color: strength.color }}>{strength.label}</p>
                                  </div>
                                )}
                              </div>

                              <PrimaryButton loading={loading} label="Create account" icon={<ArrowRight className="w-4 h-4" />} className="mt-2" />

                              <p className="text-center pt-0.5" style={{ fontSize: 12.5, color: "rgba(255,255,255,0.30)" }}>
                                Already have an account?{" "}
                                <button
                                  type="button"
                                  onClick={() => switchTab("login")}
                                  style={{ fontWeight: 600, color: "rgba(255,155,61,0.85)", transition: "color 0.15s" }}
                                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#FF9B3D")}
                                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,155,61,0.85)")}
                                >
                                  Log in
                                </button>
                              </p>
                            </motion.form>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.p
          className="mt-7 text-center"
          style={{ fontSize: 11, color: "rgba(255,255,255,0.14)", letterSpacing: "0.05em" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          Campus-only · Always free · Secure
        </motion.p>
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {successFlip && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: 50, background: "rgba(4,6,18,0.82)", backdropFilter: "blur(10px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.10 }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(16,185,129,0.12)",
                  border: "1px solid rgba(16,185,129,0.28)",
                  boxShadow: "0 0 40px rgba(16,185,129,0.18)",
                }}
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-white font-semibold" style={{ fontSize: 15 }}>Signing you in…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Shared sub-components ─────────────────────────────────────────── */

function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-label={show ? "Hide password" : "Show password"}
      onClick={onToggle}
      className="flex items-center justify-center"
      style={{ color: "rgba(255,255,255,0.42)", transition: "color 0.15s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.92)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.42)"; }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {show ? (
          <motion.span key="off" initial={{ scale: 0.55, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.55, opacity: 0 }} transition={{ duration: 0.12 }} style={{ display: "flex" }}>
            <EyeOff style={{ width: 18, height: 18 }} />
          </motion.span>
        ) : (
          <motion.span key="on" initial={{ scale: 0.55, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.55, opacity: 0 }} transition={{ duration: 0.12 }} style={{ display: "flex" }}>
            <Eye style={{ width: 18, height: 18 }} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function PrimaryButton({
  loading, label, icon, className = "",
}: {
  loading: boolean; label: string; icon?: React.ReactNode; className?: string;
}) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      className={`btn-shine relative w-full flex items-center justify-center gap-2 text-white font-semibold rounded-2xl disabled:opacity-40 overflow-hidden ${className}`}
      style={{
        paddingTop: 15,
        paddingBottom: 15,
        fontSize: 14,
        letterSpacing: "0.02em",
        background: "linear-gradient(145deg, #FFB84D 0%, #FF8520 42%, #E06000 100%)",
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.24)",
          "inset 0 -1px 0 rgba(0,0,0,0.12)",
          "0 4px 20px rgba(224,96,0,0.36)",
          "0 1px 4px rgba(0,0,0,0.28)",
        ].join(", "),
      }}
      whileHover={!loading ? {
        scale: 1.018,
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.24)",
          "inset 0 -1px 0 rgba(0,0,0,0.12)",
          "0 7px 30px rgba(224,96,0,0.52)",
          "0 2px 8px rgba(0,0,0,0.30)",
        ].join(", "),
      } : {}}
      whileTap={!loading ? { scale: 0.975 } : {}}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{label}{icon}</>}
    </motion.button>
  );
}
