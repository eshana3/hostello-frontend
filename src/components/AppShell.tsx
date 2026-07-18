"use client";

import { useAuth } from "@/providers/AuthProvider";
import LoginScreen from "@/components/LoginScreen";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import AuroraBackground from "@/components/AuroraBackground";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#06070A] flex items-center justify-center">
        <div className="relative">
          <div className="w-10 h-10 rounded-full border-2 border-[#FF7A18]/20 border-t-[#FF7A18] animate-spin" />
          <div className="absolute inset-0 rounded-full bg-[#FF7A18]/10 blur-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <>
      <AuroraBackground />

      <div className="relative z-[1] min-h-screen flex flex-col">

        <Navbar />

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex-1 pb-20 md:pb-0"
          >
            {children}
          </motion.main>
        </AnimatePresence>

        {/* Desktop Footer */}
        <div className="hidden md:block">
          <Footer />
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
          <BottomNav />
        </div>

      </div>
    </>
  );
}