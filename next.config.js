/** @type {import("next").NextConfig} */
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const nextConfig = {
  poweredByHeader: false,

  async rewrites() {
    // `fallback` (not the default `afterFiles`) so this catch-all only
    // applies when no app-router route file matches first — a plain-array
    // rewrite would otherwise shadow dynamic API routes like
    // app/api/polls/[id]/route.ts before Next.js ever resolves them.
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: "/api/:path*",
          destination: `${BACKEND_URL}/api/:path*`,
        },
      ],
    };
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/_next/static/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      // Local-backend image URLs only ever occur in dev — kept out of the
      // production remote-pattern allowlist.
      ...(process.env.NODE_ENV !== "production"
        ? [{ protocol: "http", hostname: "localhost" }]
        : []),
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [96, 128, 192, 256, 384],
  },

  experimental: {
    // Tree-shake icon libraries and animation lib — major bundle reduction
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
