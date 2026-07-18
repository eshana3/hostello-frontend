"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShoppingBag, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

export default function VerifyMagicLinkPage() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const { login: authLogin } = useAuth();

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("error");
      setMessage("Invalid link — token or email is missing.");
      return;
    }

    fetch(`/api/auth/magic-link/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          authLogin({ ...data.user, token: data.token });
          setStatus("success");
          // Give the user a moment to see the success state, then redirect
          setTimeout(() => router.replace("/"), 1200);
        } else {
          setStatus("error");
          setMessage(data.message || "This link is invalid or has expired.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Network error — could not verify the link.");
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 bg-[#FF6B00] rounded-xl flex items-center justify-center">
          <ShoppingBag className="w-4 h-4 text-white" />
        </div>
        <span className="font-black text-lg text-white">Hostel Mart</span>
      </div>

      <div className="w-full max-w-sm bg-[#1E1E2E] border border-white/[0.08] rounded-2xl p-8 text-center">
        {status === "verifying" && (
          <>
            <Loader2 className="w-10 h-10 text-[#FF6B00] animate-spin mx-auto mb-4" />
            <p className="text-white font-semibold">Verifying your link…</p>
            <p className="text-[#9CA3AF] text-sm mt-1">Just a moment</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
            <p className="text-white font-semibold">You&apos;re in!</p>
            <p className="text-[#9CA3AF] text-sm mt-1">Redirecting to Hostel Mart…</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-10 h-10 text-rose-400 mx-auto mb-4" />
            <p className="text-white font-semibold">Link expired or invalid</p>
            <p className="text-[#9CA3AF] text-sm mt-2 mb-6">{message}</p>
            <button
              onClick={() => router.replace("/")}
              className="w-full bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold py-3 rounded-xl text-sm transition-all"
            >
              Back to login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
