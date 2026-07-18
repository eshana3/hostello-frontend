"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, RotateCw, ArrowLeft } from "lucide-react";

export default function NewPollError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error("[/polls/new] failed to render:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-rose-500/10 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-rose-400" />
        </div>
        <h1 className="text-lg font-bold text-white mb-1.5">Couldn&apos;t load this page</h1>
        <p className="text-sm text-[#9CA3AF] mb-6">
          Something went wrong while posting a request. This is usually temporary.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-[#9CA3AF] hover:text-white border border-white/[0.08] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#FF6B00] hover:bg-[#E55A00] transition-colors"
          >
            <RotateCw className="w-4 h-4" /> Try again
          </button>
        </div>
      </div>
    </div>
  );
}
