"use client";

import Link from "next/link";
import { Frown } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-4 bg-[var(--bg-base)] text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-[var(--border)] flex items-center justify-center mb-6">
        <Frown size={28} className="text-[var(--text-muted)]" />
      </div>

      <h1 className="text-4xl font-extrabold text-[var(--brand-primary)] font-[family-name:var(--font-space)] mb-2">
        404
      </h1>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Page Not Found</h2>

      <p className="text-[var(--text-secondary)] mb-8 max-w-sm">
         The page you&apos;re looking for couldn&apos;t be found.
      </p>

      <Link href="/" className="btn-green">
        Return Home
      </Link>
    </div>
  );
}
