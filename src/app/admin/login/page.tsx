/**
 * AdminLoginPage.tsx — /admin/login
 * Simple password-protected gate before the admin dashboard.
 * On success, the server sets an httpOnly session cookie and
 * redirects to /admin.
 */
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Zap } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Login failed");
      }

      /* Redirect to the admin dashboard on success */
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[var(--bg-base)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 mb-4 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
            <Zap size={26} className="text-[var(--brand-primary)]" />
          </div>
          <h1 className="text-2xl font-extrabold font-[family-name:var(--font-space)] text-[var(--text-primary)]">
            SubsHub<span className="text-[var(--brand-primary)]">Admin</span>
          </h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            Sign in to manage your product catalog
          </p>
        </div>

        {/* Login card */}
        <div
          className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6"
          style={{ boxShadow: "0 0 40px rgba(34,197,94,0.06)" }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                Admin Email
              </label>
              <div className="relative mb-3">
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="Enter email"
                  required
                  autoComplete="email"
                />
              </div>

              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider"
              >
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Lock size={14} className="text-[var(--text-muted)]" />
                </div>
                <input
                  id="admin-password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-9 pr-10"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  onClick={() => setShowPass((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-400 text-xs font-medium bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password.trim() || !email.trim()}
              id="admin-login-submit"
              className="btn-primary w-full justify-center py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
