"use client";

import { useState, useEffect } from "react";
import { X, Bell, Zap } from "lucide-react";

interface Props {
  enabled: boolean;
  message: string;
  delay: number;
}

export default function AnnouncementPopup({ enabled, message, delay }: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!enabled || !message) {
      timer = setTimeout(() => setVisible(false), 0);
      return () => clearTimeout(timer);
    }

    // Check if user already dismissed THIS specific message
    const storedDismissedMsg = localStorage.getItem("subshub_popup_dismissed");
    if (storedDismissedMsg === message) {
      timer = setTimeout(() => setDismissed(true), 0);
      return () => clearTimeout(timer);
    }

    // If not dismissed, wait for the delay
    timer = setTimeout(() => {
      setVisible(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [enabled, message, delay]);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
    localStorage.setItem("subshub_popup_dismissed", message);
  };

  if (!visible || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-6 pointer-events-none animate-in fade-in duration-500">
      {/* Overlay Backdrop - only show on desktop if centered */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={handleDismiss} />

      <div className="relative w-full max-w-lg bg-[#141414] border border-white/10 rounded-[2.5rem] shadow-[0_32px_80px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto animate-in slide-in-from-bottom-12 duration-700 cubic-bezier(0.16, 1, 0.3, 1)">
        {/* Animated Glow Top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />
        
        <div className="p-8 sm:p-10">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Bell size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Official Store Notice</h4>
                  <p className="text-white font-black tracking-tight flex items-center gap-2">
                    System Hub Announcement <Zap size={14} className="text-orange-500 fill-current" />
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-lg sm:text-xl font-bold text-white/90 leading-relaxed tracking-tight">
                  {message}
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                <button 
                  onClick={handleDismiss}
                  className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60 transition-all"
                >
                  Dismiss Notice
                </button>
                <div className="text-[10px] font-black text-orange-500/40 uppercase tracking-widest">
                  Important Update
                </div>
              </div>
            </div>

            <button 
              onClick={handleDismiss}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white/20 hover:text-white transition-all transform hover:rotate-90"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
