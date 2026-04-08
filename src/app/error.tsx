"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-4 bg-[var(--bg-base)] text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
        <AlertTriangle size={28} className="text-red-400" />
      </div>

      <h2 className="text-xl font-bold text-white mb-3">Something went wrong!</h2>
      <p className="text-[var(--text-secondary)] mb-8 max-w-sm text-sm">
        An unexpected error occurred. We have logged the issue and are looking into it.
      </p>

      <button
        onClick={() => reset()}
        className="btn-ghost !text-white !bg-white/5 hover:!bg-white/10 border-[var(--border)]"
      >
        <RefreshCcw size={14} className="mr-1" />
        Try Again
      </button>
    </div>
  );
}
