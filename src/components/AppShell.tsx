"use client";
import { useAuth } from "@/providers/AuthProvider";
import LoginScreen from "@/components/LoginScreen";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  // While checking localStorage, show nothing (avoids flash)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080912] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in → show login screen (no navbar/footer)
  if (!user) {
    return <LoginScreen />;
  }

  // Logged in → show full app
  return (
    <>
      <Navbar />
      <div className="pb-16 md:pb-0">
        {children}
      </div>
      <div className="hidden md:block">
        <Footer />
      </div>
      <BottomNav />
    </>
  );
}
