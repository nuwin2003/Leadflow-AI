"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Building2, Mail, ShieldCheck, UserCircle2, Zap } from "lucide-react";

import { useApp } from "@/context/AppContext";

interface FormState {
  firstName: string;
  lastName: string;
  companyEmail: string;
  companyName: string;
  password: string;
}

const INITIAL_STATE: FormState = {
  firstName: "",
  lastName: "",
  companyEmail: "",
  companyName: "",
  password: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const { isRegistered, registerUser } = useApp();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isRegistered) return;
    router.replace("/login");
  }, [isRegistered, router]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const companyEmail = form.companyEmail.trim().toLowerCase();
    const companyName = form.companyName.trim();
    const password = form.password.trim();

    if (!firstName || !lastName || !companyEmail || !companyName || !password) {
      setError("All fields are required.");
      return;
    }

    if (!companyEmail.includes("@")) {
      setError("Enter a valid company email.");
      return;
    }

    registerUser({
      firstName,
      lastName,
      companyEmail,
      companyName,
    });

    setError("");
    router.push("/import");
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="grid min-h-screen lg:grid-cols-[1fr_520px]">
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
              First-time setup
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight">
              Create your workspace account before importing your lead CSV.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-white/65">
              We use your company profile to personalize the dashboard and onboarding flow.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs text-white/65">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 text-lg font-semibold text-white">1</p>
              <p>Register</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 text-lg font-semibold text-white">2</p>
              <p>Import CSV</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 text-lg font-semibold text-white">3</p>
              <p>Launch dashboard</p>
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
                  Create account
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Enter your company details to begin onboarding.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label" htmlFor="firstName">
                      First name
                    </label>
                    <div className="group relative">
                      <UserCircle2
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 transition-opacity group-focus-within:opacity-0"
                        size={16}
                      />
                      <input
                        id="firstName"
                        className="form-input pl-9"
                        type="text"
                        placeholder="Jane"
                        autoComplete="given-name"
                        value={form.firstName}
                        onChange={(event) => updateField("firstName", event.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label" htmlFor="lastName">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      className="form-input"
                      type="text"
                      placeholder="Doe"
                      autoComplete="family-name"
                      value={form.lastName}
                      onChange={(event) => updateField("lastName", event.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="companyEmail">
                    Company email
                  </label>
                  <div className="group relative">
                    <Mail
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 transition-opacity group-focus-within:opacity-0"
                      size={16}
                    />
                    <input
                      id="companyEmail"
                      className="form-input pl-9"
                      type="email"
                      placeholder="name@company.com"
                      autoComplete="email"
                      value={form.companyEmail}
                      onChange={(event) => updateField("companyEmail", event.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="companyName">
                    Company name
                  </label>
                  <div className="group relative">
                    <Building2
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 transition-opacity group-focus-within:opacity-0"
                      size={16}
                    />
                    <input
                      id="companyName"
                      className="form-input pl-9"
                      type="text"
                      placeholder="Acme Labs"
                      autoComplete="organization"
                      value={form.companyName}
                      onChange={(event) => updateField("companyName", event.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    className="form-input"
                    type="password"
                    placeholder="Create a password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(event) => updateField("password", event.target.value)}
                  />
                </div>

                {error ? <p className="text-xs text-red-500">{error}</p> : null}

                <button type="submit" className="btn btn-primary w-full justify-center py-2.5">
                  Create account
                  <ArrowRight size={15} />
                </button>
              </form>
            </div>

            <p className="mt-5 text-center text-xs text-gray-400">
              Already have an account?{" "}
              <Link className="font-medium text-brand-600 hover:text-brand-800" href="/login">
                Continue with Google
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
