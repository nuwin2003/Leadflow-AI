"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useApp } from "@/context/AppContext";
import type { RegisteredUserProfile } from "@/types/app";

const EMPTY_PROFILE: RegisteredUserProfile = {
  username: "",
  firstName: "",
  lastName: "",
  companyEmail: "",
  companyName: "",
  password: "",
};

export default function ProfilePage() {
  const router = useRouter();
  const { userProfile, updateUserProfile } = useApp();
  const [form, setForm] = useState<RegisteredUserProfile>(userProfile ?? EMPTY_PROFILE);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setForm(userProfile ?? EMPTY_PROFILE);
  }, [userProfile]);

  function updateField<K extends keyof RegisteredUserProfile>(
    key: K,
    value: RegisteredUserProfile[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized: RegisteredUserProfile = {
      username: form.username.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      companyEmail: form.companyEmail.trim().toLowerCase(),
      companyName: form.companyName.trim(),
      password: form.password.trim(),
    };
    if (
      !normalized.username ||
      !normalized.firstName ||
      !normalized.lastName ||
      !normalized.companyEmail ||
      !normalized.companyName ||
      !normalized.password
    ) {
      setError("All profile fields are required.");
      setSuccess("");
      return;
    }
    if (!normalized.companyEmail.includes("@")) {
      setError("Enter a valid company email.");
      setSuccess("");
      return;
    }
    updateUserProfile(normalized);
    setError("");
    setSuccess("Profile updated successfully.");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="card p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>
        <p className="mt-1 text-sm text-gray-500">
          Update your user details and company information shown in the sidebar.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="form-input"
              value={form.username}
              onChange={(event) => updateField("username", event.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label" htmlFor="firstName">
                First name
              </label>
              <input
                id="firstName"
                className="form-input"
                value={form.firstName}
                onChange={(event) => updateField("firstName", event.target.value)}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="lastName">
                Last name
              </label>
              <input
                id="lastName"
                className="form-input"
                value={form.lastName}
                onChange={(event) => updateField("lastName", event.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="companyEmail">
              Company email
            </label>
            <input
              id="companyEmail"
              className="form-input"
              type="email"
              value={form.companyEmail}
              onChange={(event) => updateField("companyEmail", event.target.value)}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="companyName">
              Company name
            </label>
            <input
              id="companyName"
              className="form-input"
              value={form.companyName}
              onChange={(event) => updateField("companyName", event.target.value)}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="form-input"
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
            />
          </div>

          {error ? <p className="text-xs text-red-500">{error}</p> : null}
          {success ? <p className="text-xs text-emerald-600">{success}</p> : null}

          <button type="submit" className="btn btn-primary py-2.5">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
