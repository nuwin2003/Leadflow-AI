"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ShieldCheck, Zap } from "lucide-react";

import { useApp } from "@/context/AppContext";
import {
  AUTH_API,
  isApiSuccess,
  parseUserFromApi,
  type LoginApiResponse,
} from "@/lib/authApi";

export default function LoginPage() {
  const router = useRouter();
  const { hasCompletedCsvImport, isRegistered, setLoginSession, userProfile } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successPopup, setSuccessPopup] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const leftPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setJustRegistered(params.get("registered") === "1");
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = leftPanelRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 24;
    const y = ((e.clientY - top) / height - 0.5) * 24;
    const orbs = el.querySelectorAll<HTMLElement>("[data-orb]");
    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 7;
      orb.style.transform = `translate(${(x * depth) / 10}px, ${(y * depth) / 10}px)`;
    });
  };

  const handleMouseLeave = () => {
    const el = leftPanelRef.current;
    if (!el) return;
    el.querySelectorAll<HTMLElement>("[data-orb]").forEach((orb) => {
      orb.style.transform = "";
    });
  };

  async function handleCredentialsSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessPopup("");

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError("Enter username and password.");
      return;
    }

    setIsSubmitting(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(AUTH_API.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          username: trimmedUsername,
          password: trimmedPassword,
        }),
      });

      const text = await response.text();
      let data: LoginApiResponse = {};
      try {
        data = text ? (JSON.parse(text) as LoginApiResponse) : {};
      } catch {
        data = { message: text };
      }

      if (!response.ok) {
        setError(data.message ?? `Login request failed (${response.status}).`);
        return;
      }

      if (!isApiSuccess(data)) {
        setError(data.message ?? "Login failed.");
        return;
      }

      const profile =
        parseUserFromApi(data.user) ??
        (userProfile
          ? {
              username: String(data.user?.username ?? userProfile.username).trim(),
              firstName: String(data.user?.firstName ?? userProfile.firstName).trim(),
              lastName: String(data.user?.lastName ?? userProfile.lastName).trim(),
              companyEmail: String(data.user?.email ?? userProfile.companyEmail)
                .trim()
                .toLowerCase(),
              companyName: String(data.user?.companyName ?? userProfile.companyName).trim(),
            }
          : null);
      if (!profile) {
        setError("Login succeeded but user profile was missing from the response.");
        return;
      }

      setLoginSession(profile);

      setSuccessPopup(data.message ?? "Login successful");
      setTimeout(() => {
        router.push(hasCompletedCsvImport ? "/dashboard" : "/import");
      }, 900);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Login request timed out. Please try again.");
        return;
      }
      setError("Unable to reach login server.");
    } finally {
      clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen font-dm text-gray-900">
      <div className="grid min-h-screen lg:grid-cols-[1fr_480px]">
        <section
          ref={leftPanelRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative hidden overflow-hidden px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between"
          style={{
            background:
              "linear-gradient(135deg, #020d1f 0%, #04183d 35%, #071f52 65%, #0a2d6e 100%)",
          }}
        >
          <div
            data-orb="1"
            className="animate-drift-1 pointer-events-none absolute rounded-full"
            style={{
              width: "380px",
              height: "380px",
              top: "-80px",
              right: "-100px",
              background: "radial-gradient(circle, rgba(21,101,192,0.55) 0%, transparent 70%)",
              filter: "blur(55px)",
            }}
          />
          <div
            data-orb="2"
            className="animate-drift-2 pointer-events-none absolute rounded-full"
            style={{
              width: "280px",
              height: "280px",
              bottom: "30px",
              left: "-50px",
              background: "radial-gradient(circle, rgba(2,136,209,0.5) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
          <div
            data-orb="3"
            className="animate-drift-3 pointer-events-none absolute rounded-full"
            style={{
              width: "180px",
              height: "180px",
              top: "50%",
              left: "50%",
              background: "radial-gradient(circle, rgba(249,168,37,0.2) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div className="grid-overlay pointer-events-none absolute inset-0" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <Zap size={22} />
            </div>
            <div>
              <p className="font-reglo text-xl font-bold leading-tight">LeadFlow AI</p>
              <p className="font-dm text-sm text-white/60">B2B Sales Automation</p>
            </div>
          </div>

          <div className="relative z-10 max-w-xl">
            <p className="font-dm relative z-10 mb-4 inline-flex rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white/75">
              Universal sales workspace
            </p>
            <h1 className="gradient-text-gold relative z-10 mb-4 font-reglo text-4xl font-bold leading-[1.12] lg:text-[2.75rem]">
              Sign in to manage campaigns, leads, and automation workflows.
            </h1>
            <p className="font-dm relative z-10 mt-5 max-w-lg text-base leading-7 text-white/65">
              Keep prospect data, campaign performance, and integration status in one
              secure dashboard.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-3">
            <div
              className="relative z-10 cursor-default rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "0.5px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span className="gradient-text-gold font-reglo block text-3xl font-bold">312</span>
              <span className="font-dm text-xs tracking-wide" style={{ color: "#78909c" }}>
                Total leads
              </span>
            </div>
            <div
              className="relative z-10 cursor-default rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "0.5px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span className="gradient-text-gold font-reglo block text-3xl font-bold">8</span>
              <span className="font-dm text-xs tracking-wide" style={{ color: "#78909c" }}>
                Workflows
              </span>
            </div>
            <div
              className="relative z-10 cursor-default rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "0.5px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span className="gradient-text-gold font-reglo block text-3xl font-bold">34%</span>
              <span className="font-dm text-xs tracking-wide" style={{ color: "#78909c" }}>
                Open rate
              </span>
            </div>
          </div>
        </section>

        <section
          className="flex items-center justify-center px-5 py-10 sm:px-8"
          style={{ background: "#f0f4fb" }}
        >
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Zap size={20} />
              </div>
              <div>
                <p className="font-reglo text-lg font-bold leading-tight">LeadFlow AI</p>
                <p className="font-dm text-sm text-gray-500">B2B Sales Automation</p>
              </div>
            </div>

            <div
              className="rounded-2xl bg-white p-8"
              style={{ border: "0.5px solid #dde8f8" }}
            >
              <div className="mb-7">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <ShieldCheck size={22} />
                </div>
                <h2 className="font-reglo text-3xl font-bold tracking-tight text-gray-900">
                  Welcome back
                </h2>
                <p className="font-dm mt-2 text-base text-gray-500">
                  Sign in with your username and password.
                </p>
              </div>

              <form className="font-dm" onSubmit={handleCredentialsSignIn}>
                <div>
                  <label className="form-label" htmlFor="username">
                    Username
                  </label>
                  <input
                    id="username"
                    className="form-input mb-4"
                    type="text"
                    placeholder="client2"
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    className="form-input mb-4"
                    type="password"
                    placeholder="Enter password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-lg font-reglo w-full tracking-wide"
                >
                  {isSubmitting ? "Logging in..." : "Login →"}
                </button>
              </form>

              {error ? <p className="font-dm mt-4 text-sm text-red-500">{error}</p> : null}

              <p className="font-dm mt-5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-center text-sm text-gray-600">
                {justRegistered
                  ? "Account created successfully. Please sign in to continue."
                  : isRegistered
                    ? "Sign in with your registered username and password."
                    : "Create your account first, then sign in with your credentials."}
              </p>
            </div>

            <p className="font-dm mt-5 text-center text-sm text-gray-500">
              First time here?{" "}
              <Link
                className="font-medium text-brand-600 hover:text-brand-800"
                href="/register"
              >
                Register User Company
              </Link>
            </p>
          </div>
        </section>
      </div>

      {successPopup ? (
        <div className="font-dm fixed bottom-4 right-4 z-50 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 shadow-sm">
          {successPopup}
        </div>
      ) : null}
    </main>
  );
}
