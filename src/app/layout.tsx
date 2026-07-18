import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { SocketProvider } from "@/providers/SocketProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import AppShell from "@/components/AppShell";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_NAME = "Hostel Mart";
const SITE_DESCRIPTION = "Buy & sell within your hostel — fast, free, on campus";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} – Buy & Sell on Campus`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["hostel marketplace", "campus buy and sell", "student marketplace", "hostel mart"],
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} – Buy & Sell on Campus`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} – Buy & Sell on Campus`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
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
                        background: "#0B0F17",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "14px",
                        fontSize: "13px",
                        color: "#fff",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
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
