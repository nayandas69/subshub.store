"use client";

import { useEffect, useRef } from "react";
import { type Product } from "@/lib/types";
import { X, MessageCircle, CheckCircle2, ChevronRight } from "lucide-react";
import ProductIcon from "@/components/ProductIcon";
import { SITE_CONFIG } from "@/lib/site-config";

/** Build WhatsApp deep-link with a pre-filled order message */
function buildWhatsAppUrl(product: Product, tier: string, price: number, currency: string): string {
  const message = encodeURIComponent(
    `Hi! I want to order:\n\n` +
    `📦 *${product.name}* — ${tier}\n` +
    `💰 Price: ${currency}${price}\n\n` +
    `Please confirm availability. Thank you!`
  );
  return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${message}`;
}

interface ProductModalProps {
  product: Product;
  currency: string;
  onClose: () => void;
}

export default function ProductModal({ product, currency, onClose }: ProductModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="modal-backdrop"
      onClick={(e) => e.target === overlayRef.current && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-box">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start gap-3 p-5 border-b border-[var(--border)]">
          <ProductIcon
            name={product.icon}
            bg={product.iconBg}
            color={product.iconColor}
            size={40}
          />

          <div className="flex-1 min-w-0">
            <h2
              id="modal-title"
              className="font-bold text-[var(--text-primary)] text-base leading-tight font-[family-name:var(--font-space)]"
            >
              {product.name}
            </h2>
            <p className="text-[var(--text-secondary)] text-xs mt-0.5">
              {product.description}
            </p>
            <div className="flex items-center gap-1 mt-1.5">
              <CheckCircle2 size={10} className="text-[var(--brand-primary)]" />
              <span className="text-[0.68rem] text-[var(--brand-primary)] font-semibold">
                {product.plans?.length || 0} {product.plans?.length === 1 ? "plan" : "plans"} available
              </span>
            </div>
            {product.features && product.features.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {product.features.map((f, i) => (
                  <span key={i} className="text-[10px] bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] px-2 py-0.5 rounded-full font-bold border border-[var(--brand-primary)]/20">
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="rounded-full w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Close"
            id="modal-close-btn"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Plans ──────────────────────────────────────────────────────── */}
        <div className="p-5 flex flex-col gap-3">
          {(product.plans || []).map((plan) => (
            <div key={plan.id} className="plan-row">
              {/* Tier + original price row */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.65rem] font-bold tracking-widest uppercase text-[var(--text-muted)]">
                  {plan.tier}
                </span>
                {plan.originalPrice && (
                  <span className="text-[0.65rem] text-red-400 line-through">
                    {currency} {plan.originalPrice}
                  </span>
                )}
              </div>

              {/* Price + CTA */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-[family-name:var(--font-space)] font-black text-xl text-[var(--text-primary)] tracking-tight">
                    {currency}{plan.price}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">/ {plan.duration}</span>
                  {plan.originalPrice && (
                    <span className="text-[0.62rem] text-[var(--brand-hover)] font-bold bg-[var(--brand-hover)]/10 border border-[var(--brand-hover)]/20 rounded px-1.5 py-0.5">
                      SAVE {currency}{plan.originalPrice - plan.price}
                    </span>
                  )}
                </div>

                {/* Buy Now → WhatsApp deep link */}
                <a
                  href={buildWhatsAppUrl(product, `${plan.tier} (${plan.duration})`, plan.price, currency)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  id={`buy-${plan.id}`}
                  aria-label={`Buy ${product.name} ${plan.tier} for ${currency}${plan.price} via WhatsApp`}
                >
                  <MessageCircle size={13} />
                  Buy Now
                </a>
              </div>
            </div>
          ))}

          {/* Footer note */}
          <a
            href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 mt-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-[0.72rem] transition-colors group"
          >
            <CheckCircle2 size={11} className="text-[var(--brand-primary)]" />
            <span className="group-hover:text-[var(--text-primary)]">
              Available on WhatsApp · Instant Delivery
            </span>
            <ChevronRight size={11} className="group-hover:text-[var(--text-primary)]" />
          </a>
        </div>
      </div>
    </div>
  );
}
