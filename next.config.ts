/**
 * next.config.ts
 * Production-ready Next.js 16 configuration.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ── Performance ──────────────────────────────────────────────────────── */
  compress: true,

  /* ── Image optimization ────────────────────────────────────────────────── */
  images: {
    formats: ["image/avif", "image/webp"],
    // Add external image domains here if needed, e.g.:
    // remotePatterns: [{ hostname: "example.com" }],
  },

  /* ── Security headers ──────────────────────────────────────────────────── */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",        value: "DENY" },
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
