"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import dynamic from "next/dynamic";

// Only load devtools in development — excluded from production bundle
const ReactQueryDevtools =
  process.env.NODE_ENV !== "production"
    ? dynamic(
        () =>
          import("@tanstack/react-query-devtools").then((m) => ({
            default: m.ReactQueryDevtools,
          })),
        { ssr: false }
      )
    : () => null;

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: 1,
            // Don't refetch when the window regains focus — reduces unnecessary
            // network requests when users tab back into the app
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
