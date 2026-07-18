export default function NewPollLoading() {
  return (
    <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-[#FF6B00]/20 border-t-[#FF6B00] animate-spin" />
        <div className="absolute inset-0 rounded-full bg-[#FF6B00]/10 blur-lg animate-pulse" />
      </div>
    </div>
  );
}
