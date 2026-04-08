"use client";

import React from "react";
import { Check } from "lucide-react";

const CURRENCIES = [
  { symbol: "$", code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { symbol: "€", code: "EUR", name: "Euro", flag: "🇪🇺" },
  { symbol: "৳", code: "BDT", name: "Taka", flag: "🇧🇩" },
  { symbol: "₹", code: "INR", name: "Rupee", flag: "🇮🇳" },
  { symbol: "£", code: "GBP", name: "Pound", flag: "🇬🇧" },
];

interface CurrencyPickerProps {
  current: string;
  onSelect: (symbol: string) => void;
}

export default function CurrencyPicker({ current, onSelect }: CurrencyPickerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
      {CURRENCIES.map((c) => {
        const isActive = current === c.symbol;
        return (
          <button
            key={c.code}
            onClick={() => onSelect(c.symbol)}
            className={`
              relative p-5 rounded-3xl border-2 transition-all text-left flex flex-col gap-2 group
              ${isActive 
                ? "bg-[var(--brand-primary)] border-[var(--brand-primary)] text-black" 
                : "bg-white/5 border-white/5 hover:border-white/20 text-white/40 hover:text-white"
              }
            `}
          >
            {isActive && (
              <div className="absolute top-3 right-3 bg-white/20 p-1 rounded-full text-black">
                <Check size={12} strokeWidth={4} />
              </div>
            )}
            <span className="text-2xl">{c.flag}</span>
            <div>
              <span className={`block font-black text-lg leading-tight ${isActive ? 'text-black' : 'text-white'}`}>
                {c.symbol} {c.code}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-widest opacity-60`}>
                {c.name}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
