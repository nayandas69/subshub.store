"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { Search, X } from "lucide-react";

const CATEGORIES = {
  Streaming: ["Tv", "Film", "MonitorPlay", "Cast", "Play", "Video"],
  Gaming: ["Gamepad", "Gamepad2", "Joystick", "Trophy", "Dices", "Target"],
  Music: ["Music", "Mic", "Headphones", "Disc", "Radio"],
  Security: ["Shield", "Lock", "UserCheck", "Globe", "Key", "Eye"],
  AI: ["Zap", "Brain", "Cpu", "Layers", "Sparkles", "Lightbulb"],
  Shop: ["ShoppingBag", "CreditCard", "Tag", "Store", "Package"],
  Misc: ["Star", "Heart", "Smile", "Flame", "Crown", "Gift"]
};

const ALL_ICONS = Object.values(CATEGORIES).flat();

interface IconPickerProps {
  onSelect: (iconName: string) => void;
  currentIcon: string;
}

export default function IconPicker({ onSelect, currentIcon }: IconPickerProps) {
  const [search, setSearch] = useState("");

  const filteredIcons = ALL_ICONS.filter(name => 
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col max-h-[400px]">
      {/* Search Header */}
      <div className="p-3 border-b border-[var(--border)] bg-[var(--bg-base)] flex items-center gap-2">
        <Search size={16} className="text-[var(--text-muted)]" />
        <input 
          className="bg-transparent border-none outline-none text-sm w-full"
          placeholder="Search icons (e.g. game, tv)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Icon Grid */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        {search ? (
          <div className="grid grid-cols-6 gap-2">
            {filteredIcons.map(name => (
              <IconButton key={name} name={name} active={currentIcon === name} onClick={() => onSelect(name)} />
            ))}
            {filteredIcons.length === 0 && <p className="col-span-6 text-center text-xs text-[var(--text-muted)] py-4">No icons found</p>}
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(CATEGORIES).map(([cat, icons]) => (
              <div key={cat}>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 px-1">{cat}</h4>
                <div className="grid grid-cols-6 gap-2">
                  {icons.map(name => (
                    <IconButton key={name} name={name} active={currentIcon === name} onClick={() => onSelect(name)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function IconButton({ name, active, onClick }: { name: string, active: boolean, onClick: () => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  
  return (
    <button 
      onClick={onClick}
      className={`
        aspect-square flex flex-col items-center justify-center p-2 rounded-lg border transition-all
        ${active 
          ? "bg-[var(--brand-primary)]/10 border-[var(--brand-primary)] text-[var(--brand-primary)]" 
          : "bg-[var(--bg-input)] border-transparent hover:border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        }
      `}
      title={name}
    >
      <Icon size={20} />
      <span className="text-[8px] mt-1 opacity-60 truncate w-full px-0.5">{name}</span>
    </button>
  );
}
