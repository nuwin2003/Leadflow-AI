"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Building2, Mail, ShieldCheck, UserCircle2, Zap } from "lucide-react";

import { useApp } from "@/context/AppContext";
import { AUTH_API, isApiSuccess } from "@/lib/authApi";

interface FormState {
  username: string;
  firstName: string;
  lastName: string;
  companyEmail: string;
  companyName: string;
  password: string;
}

const INITIAL_STATE: FormState = {
  username: "",
  firstName: "",
  lastName: "",
  companyEmail: "",
  companyName: "",
  password: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useApp();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [error, setError] = useState("");
  const [successPopup, setSuccessPopup] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessPopup("");

    const username = form.username.trim();
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const companyEmail = form.companyEmail.trim().toLowerCase();
    const companyName = form.companyName.trim();
    const password = form.password.trim();

    if (!username || !firstName || !lastName || !companyEmail || !companyName || !password) {
      setError("All fields are required.");
      return;
    }

    if (!companyEmail.includes("@")) {
      setError("Enter a valid company email.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(AUTH_API.signup, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          firstName,
          lastName,
          password,
          companyName,
          email: companyEmail,
        }),
      });

      if (!response.ok) {
        setError("Signup request failed. Please try again.");
        return;
      }

      const data = (await response.json()) as {
        success?: string | boolean;
        status?: string;
        message?: string;
      };

      if (!isApiSuccess(data)) {
        setError(data.message ?? "Signup failed.");
        return;
      }

      registerUser({
        username,
        firstName,
        lastName,
        companyEmail,
        companyName,
      });

      setSuccessPopup(data.message ?? "User Signup Success");
      setTimeout(() => {
        router.replace("/login?registered=1");
      }, 900);
    } catch {
      setError("Unable to reach signup server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen text-gray-900">
      <div className="grid min-h-screen lg:grid-cols-[1fr_520px]">
        <section
          className="relative hidden overflow-hidden px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between"
          style={{
            background:
              "linear-gradient(135deg, #020d1f 0%, #04183d 35%, #071f52 65%, #0a2d6e 100%)",
          }}
        >
          {/* Orb 1 */}
          <div
            className="animate-drift-1 pointer-events-none absolute rounded-full"
            style={{
              width: "380px", height: "380px",
              top: "-80px", right: "-100px",
              background: "radial-gradient(circle, rgba(21,101,192,0.55) 0%, transparent 70%)",
              filter: "blur(55px)",
            }}
          />
          {/* Orb 2 */}
          <div
            className="animate-drift-2 pointer-events-none absolute rounded-full"
            style={{
              width: "280px", height: "280px",
              bottom: "30px", left: "-50px",
              background: "radial-gradient(circle, rgba(2,136,209,0.5) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
          {/* Orb 3 */}
          <div
            className="animate-drift-3 pointer-events-none absolute rounded-full"
            style={{
              width: "180px", height: "180px",
              top: "50%", left: "50%",
              background: "radial-gradient(circle, rgba(249,168,37,0.2) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          {/* Grid overlay */}
          <div className="grid-overlay pointer-events-none absolute inset-0" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <Zap size={22} />
            </div>
            <div>
              <p className="font-reglo text-xl font-bold leading-tight">LeadFlow AI</p>
              <p className="text-sm text-white/60">B2B Sales Automation</p>
            </div>
          </div>

          <div className="relative z-10 max-w-xl">
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white/75">
              First-time setup
            </p>
            <h1 className="gradient-text-gold mb-4 font-reglo text-4xl font-bold leading-[1.12] lg:text-[2.75rem]">
              Create your workspace account before importing your lead CSV.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/65">
              We use your company profile to personalize the dashboard and onboarding flow.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-3">
            {[
              { step: "1", label: "Register" },
              { step: "2", label: "Import CSV" },
              { step: "3", label: "Launch dashboard" },
            ].map(({ step, label }) => (
              <div
                key={step}
                className="cursor-default rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <span className="gradient-text-gold font-reglo block text-3xl font-bold">
                  {step}
                </span>
                <span className="text-xs tracking-wide" style={{ color: "#78909c" }}>
                  {label}
                </span>
              </div>
            ))}
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
                <p className="text-sm text-gray-500">B2B Sales Automation</p>
              </div>
            </div>

            <div
              className="rounded-2xl bg-white p-6 sm:p-8"
              style={{ border: "0.5px solid #dde8f8" }}
            >
              <div className="mb-7">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                  <ShieldCheck size={22} />
                </div>
                <h2 className="font-reglo text-3xl font-bold tracking-tight text-gray-900">
                  Register company
                </h2>
                <p className="mt-2 text-base text-gray-600">
                  Enter your company details to begin onboarding.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="form-label" htmlFor="username">
                    Username
                  </label>
                  <input
                    id="username"
                    className="form-input"
                    type="text"
                    placeholder="client1"
                    autoComplete="username"
                    value={form.username}
                    onChange={(event) => updateField("username", event.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label" htmlFor="firstName">
                      First name
                    </label>
                    <div className="group relative">
                      <input
                        id="firstName"
                        className="peer form-input pl-9 focus:placeholder-transparent"
                        style={{ paddingLeft: "2.25rem" }}
                        type="text"
                        placeholder="Jane"
                        autoComplete="given-name"
                        value={form.firstName}
                        onChange={(event) => updateField("firstName", event.target.value)}
                      />
                      <UserCircle2
                        className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400 transition-opacity peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0"
                        size={16}
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
                    <input
                      id="companyEmail"
                      className="peer form-input pl-9 focus:placeholder-transparent"
                      style={{ paddingLeft: "2.25rem" }}
                      type="email"
                      placeholder="name@company.com"
                      autoComplete="email"
                      value={form.companyEmail}
                      onChange={(event) => updateField("companyEmail", event.target.value)}
                    />
                    <Mail
                      className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400 transition-opacity peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0"
                      size={16}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="companyName">
                    Company name
                  </label>
                  <div className="group relative">
                    <input
                      id="companyName"
                      className="peer form-input pl-9 focus:placeholder-transparent"
                      style={{ paddingLeft: "2.25rem" }}
                      type="text"
                      placeholder="Acme Labs"
                      autoComplete="organization"
                      value={form.companyName}
                      onChange={(event) => updateField("companyName", event.target.value)}
                    />
                    <Building2
                      className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400 transition-opacity peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0"
                      size={16}
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

                {error ? <p className="text-sm text-red-500">{error}</p> : null}

                <button type="submit" className="btn btn-primary btn-lg w-full justify-center">
                  {isSubmitting ? "Registering company..." : "Register company"}
                  <ArrowRight size={15} />
                </button>
              </form>
            </div>

            <p className="mt-5 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link className="font-semibold text-brand-700 hover:text-brand-900" href="/login">
                Sign in
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
