"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, Zap } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const {
    hasCompletedCsvImport,
    isRegistered,
    loginWithCredentials,
    markAuthenticatedSession,
  } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successPopup, setSuccessPopup] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setJustRegistered(params.get("registered") === "1");
  }, []);

  async function handleCredentialsSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessPopup("");
    setIsSubmitting(true);

    try {
      const response = await fetch("https://nuwin2003.app.n8n.cloud/webhook-test/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email.trim(),
          password: password.trim(),
        }),
      });

      if (!response.ok) {
        setError("Login request failed. Please try again.");
        return;
      }

      const data = (await response.json()) as {
        status?: string;
        message?: string;
      };

      if (data.status !== "success") {
        setError(data.message ?? "Login failed.");
        return;
      }

      const localCheck = loginWithCredentials(email, password);
      if (!localCheck.ok) {
        // If local registered profile isn't set yet, still allow webhook-authenticated session.
        markAuthenticatedSession();
      }

      setSuccessPopup(data.message ?? "User Login Success");
      setTimeout(() => {
        router.push(hasCompletedCsvImport ? "/dashboard" : "/import");
      }, 900);
    } catch {
      setError("Unable to reach login server.");
    } finally {
      setIsSubmitting(false);
    }
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
                  Login with your username/email and password.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleCredentialsSignIn}>
                <div>
                  <label className="form-label" htmlFor="email">
                    Username or email
                  </label>
                  <div className="group relative">
                    <Mail
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 transition-opacity group-focus-within:opacity-0"
                      size={16}
                    />
                    <input
                      id="email"
                      className="form-input pl-9 focus:placeholder-transparent"
                      type="text"
                      placeholder="client1 or name@company.com"
                      autoComplete="username"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <div className="group relative">
                    <LockKeyhole
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 transition-opacity group-focus-within:opacity-0"
                      size={16}
                    />
                    <input
                      id="password"
                      className="form-input pl-9 focus:placeholder-transparent"
                      type="password"
                      placeholder="Enter password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full justify-center py-2.5">
                  {isSubmitting ? "Logging in..." : "Login"}
                  <ArrowRight size={15} />
                </button>
              </form>

              {error ? <p className="mt-4 text-xs text-red-500">{error}</p> : null}

              <p className="mt-5 rounded-lg bg-gray-50 px-3 py-2 text-center text-xs text-gray-400">
                {justRegistered
                  ? "Account created successfully. Please login to continue."
                  : isRegistered
                    ? "Registered users can login using username/email and password."
                    : "Create your account first, then login with your credentials."}
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

      {successPopup ? (
        <div className="fixed bottom-4 right-4 z-50 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 shadow-sm">
          {successPopup}
        </div>
      ) : null}
    </main>
  );
}
