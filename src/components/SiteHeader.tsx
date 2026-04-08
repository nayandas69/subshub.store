/**
 * SiteHeader.tsx
 * Brand header with configurable site name from env vars.
 * Trust badges: Verified, 15m Delivery, Secure Pay.
 */
import { ShieldCheck, Clock, Lock } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

export default function SiteHeader() {
  return (
    <header className="site-header px-4 pt-7 pb-6">
      <div className="max-w-5xl mx-auto">
        {/* Brand name — fetched from env */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1 font-[family-name:var(--font-space)]">
          <span className="text-[var(--text-primary)]">{SITE_CONFIG.name}</span>
          <span className="text-green-400">.store</span>
        </h1>

        {/* Tagline */}
        <p className="text-[var(--text-secondary)] text-sm mb-4 max-w-xs">
          {SITE_CONFIG.tagline}
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-4">
          <TrustBadge icon={<ShieldCheck size={12} />} label="Verified" />
          <TrustBadge icon={<Clock size={12} />}       label="15m Delivery" />
          <TrustBadge icon={<Lock size={12} />}        label="Secure Pay" />
        </div>
      </div>
    </header>
  );
}

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
      {icon}
      {label}
    </span>
  );
}
