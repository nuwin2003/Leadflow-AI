"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck, Zap } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const { hasCompletedCsvImport, isAuthenticated, isHydrated, loginWithGoogle } = useApp();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;
    router.replace(hasCompletedCsvImport ? "/dashboard" : "/import");
  }, [hasCompletedCsvImport, isAuthenticated, isHydrated, router]);

  function handleGoogleSignIn() {
    const result = loginWithGoogle();
    setError("");
    router.push(result.needsProfile ? "/register" : "/import");
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="grid min-h-screen lg:grid-cols-[1fr_480px]">
        <section className="hidden bg-brand-900 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <Zap size={22} />
            </div>
            <div>
              <p className="text-lg font-semibold leading-tight">LeadFlow AI</p>
              <p className="text-xs text-white/60">B2B Sales Automation</p>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/75">
              Universal sales workspace
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight">
              Sign in to manage campaigns, leads, and automation workflows.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-white/65">
              Keep prospect data, campaign performance, and integration status in one
              secure dashboard.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs text-white/65">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 text-lg font-semibold text-white">312</p>
              <p>Total leads</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 text-lg font-semibold text-white">8</p>
              <p>Workflows</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 text-lg font-semibold text-white">34%</p>
              <p>Open rate</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Zap size={20} />
              </div>
              <div>
                <p className="text-base font-semibold leading-tight">LeadFlow AI</p>
                <p className="text-xs text-gray-400">B2B Sales Automation</p>
              </div>
            </div>

            <div className="card p-6 shadow-sm sm:p-8">
              <div className="mb-7">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <ShieldCheck size={22} />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Continue with Google to access your LeadFlow AI workspace.
                </p>
              </div>

              <button
                type="button"
                className="btn w-full justify-center gap-2 py-2.5"
                aria-label="Continue with Google"
                onClick={handleGoogleSignIn}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-700">
                  G
                </span>
                Continue with Gmail
              </button>

              {error ? <p className="mt-4 text-xs text-red-500">{error}</p> : null}

              <p className="mt-5 rounded-lg bg-gray-50 px-3 py-2 text-center text-xs text-gray-400">
                Google authentication is mocked for now. n8n integration will be connected later.
              </p>
            </div>

            <p className="mt-5 text-center text-xs text-gray-400">
              First time here?{" "}
              <Link className="font-medium text-brand-600 hover:text-brand-800" href="/register">
                Add your company details
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
