/**
 * Root Layout — app/layout.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Sets up global fonts (Inter + Space Grotesk), metadata, and wraps all pages.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type { Metadata } from "next";
import "./globals.css";

/* ── SEO Metadata ─────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "SubsHub Digital Subscriptions | Instant Delivery via WhatsApp",
  description:
    "Buy SubsHub digital subscriptions, VPNs, AI Tools and more at unbeatable prices. Fast, secure, and reliable service with instant WhatsApp delivery.",
  keywords: [
    "digital subscriptions",
    "premium accounts",
    "VPN subscriptons",
    "AI Tools subscription",
    "WhatsApp delivery",
    "cheap premium accounts"
  ],
  openGraph: {
    title: "SubsHub Digital Subscriptions",
    description: "Instant digital subscriptions delivered via WhatsApp.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

/* ── Root Layout ──────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --font-inter: 'Inter', sans-serif;
              --font-space: 'Space Grotesk', sans-serif;
            }
          `
        }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
