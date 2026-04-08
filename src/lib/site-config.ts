/**
 * site-config.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Central site configuration — change NEXT_PUBLIC_SITE_NAME in .env.local
 * to customise the brand without touching any component files.
 */

export const SITE_CONFIG = {
  /** Brand name shown in UI  */
  name:        process.env.NEXT_PUBLIC_SITE_NAME  ?? "SubsHub",
  /** Tagline shown in the header */
  tagline:     "Premium subscriptions at unbeatable prices. Instant delivery via WhatsApp.",
  /** WhatsApp phone number (with country code, no +) */
  whatsapp:    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "8801XXXXXXXXX",
  /** Site URL — used in canonical / OG tags */
  url:         process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  /** SEO description */
  description: "Buy Netflix, ChatGPT, VPNs, AI Tools and more at unbeatable prices. Instant delivery via WhatsApp. Verified · 15m Delivery · Secure Pay.",
};
