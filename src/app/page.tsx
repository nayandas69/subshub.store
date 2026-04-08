/**
 * app/page.tsx — Main Storefront (Server Component)
 * Renders: FlashSaleBanner → SiteHeader → ProductList (client island)
 */
import FlashSaleBanner from "@/components/FlashSaleBanner";
import SiteHeader      from "@/components/SiteHeader";
import ProductList     from "@/components/ProductList";


import { SITE_CONFIG } from "@/lib/site-config";
import AnnouncementPopup from "@/components/AnnouncementPopup";
import { connectToDatabase } from "@/lib/db";
import SettingsModel from "@/models/Settings";

export const dynamic = "force-dynamic";

export default async function StorePage() {
  await connectToDatabase();
  const settings = await SettingsModel.findOne().lean();
  
  const popupSettings = {
    enabled: settings?.popupEnabled || false,
    message: settings?.popupText || "",
    delay: settings?.popupDelay || 5
  };

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Global Announcement Popup (Timed) */}
      <AnnouncementPopup 
        enabled={popupSettings.enabled} 
        message={popupSettings.message} 
        delay={popupSettings.delay} 
      />

      {/* Top flash sale banner with countdown */}

      <FlashSaleBanner />

      {/* Brand header */}
      <SiteHeader />

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <ProductList />
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-8">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center justify-center gap-6">
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/30 transition-all" aria-label="Facebook">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12a12 12 0 10-13.88 11.85v-8.38H7.08v-3.47h3.04V9.36c0-3 1.79-4.66 4.54-4.66 1.31 0 2.68.23 2.68.23v2.95h-1.5c-1.5 0-1.96.93-1.96 1.88v2.26h3.32l-.53 3.47h-2.79v8.38A12 12 0 1024 12z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[#FF0000]/10 hover:text-[#FF0000] hover:border-[#FF0000]/30 transition-all" aria-label="YouTube">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5 6.18a3 3 0 00-2.11-2.13C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.39.55A3 3 0 00.5 6.18C0 8.07 0 12 0 12s0 3.93.5 5.82a3 3 0 002.11 2.13c1.89.55 9.39.55 9.39.55s7.5 0 9.39-.55a3 3 0 002.11-2.13c.5-1.89.5-5.82.5-5.82s0-3.93-.5-5.82zM9.54 15.57V8.43L15.82 12l-6.28 3.57z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[#E1306C]/10 hover:text-[#E1306C] hover:border-[#E1306C]/30 transition-all" aria-label="Instagram">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.22.41.56.22.96.48 1.36.88.4.4.66.8.88 1.36.16.42.36 1.05.41 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.22-.22.56-.48.96-.88 1.36-.4.4-.8.66-1.36.88-.42.16-1.05.36-2.22.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.22-.41-.56-.22-.96-.48-1.36-.88-.4-.4-.66-.8-.88-1.36-.16-.42-.36-1.05-.41-2.22C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.22.22-.56.48-.96.88-1.36.4-.4.8-.66 1.36-.88.42-.16 1.05-.36 2.22-.41C8.42 2.17 8.8 2.16 12 2.16zm0-2.16C8.74 0 8.33.01 7.05.07c-1.27.06-2.13.27-2.89.56a5.88 5.88 0 00-2.12 1.38c-.62.62-1.09 1.36-1.38 2.12-.29.76-.5 1.62-.56 2.89C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.27 2.13.56 2.89.29.76.76 1.5 1.38 2.12.62.62 1.36 1.09 2.12 1.38.76.29 1.62.5 2.89.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.27-.06 2.13-.27 2.89-.56a5.88 5.88 0 002.12-1.38c.62-.62 1.09-1.36 1.38-2.12.29-.76.5-1.62.56-2.89.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.13-.56-2.89a5.88 5.88 0 00-1.38-2.12c-.62-.62-1.36-1.09-2.12-1.38-.76-.29-1.62-.5-2.89-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1012 18.16 6.16 6.16 0 0012 5.84zm0 10.16a4 4 0 110-8 4 4 0 010 8zm3.96-10.45a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/></svg>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3 pt-4 border-t border-[var(--border)]">
            <p className="text-[var(--text-muted)] text-xs">
              © {new Date().getFullYear()} {SITE_CONFIG.name} — All rights reserved.
            </p>
            <a
              href="https://github.com/nayandas69/SubsHub.store"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs transition-colors flex items-center gap-1"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Source Code
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
