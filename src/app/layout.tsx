import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { SocketProvider } from "@/providers/SocketProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import AppShell from "@/components/AppShell";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Hostello – Buy & Sell on Campus",
  description: "Buy & sell within your hostel — fast, free, on campus",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              <SocketProvider>
                <ToastProvider>
                  <AppShell>{children}</AppShell>
                  <Toaster
                    position="bottom-right"
                    toastOptions={{
                      style: {
                        background: "var(--toast-bg, white)",
                        border: "1px solid rgba(226,232,240,1)",
                        borderRadius: "12px",
                        fontSize: "13px",
                      },
                    }}
                  />
                </ToastProvider>
              </SocketProvider>
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
