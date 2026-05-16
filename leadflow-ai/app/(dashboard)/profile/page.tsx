"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useApp } from "@/context/AppContext";
import {
  AUTH_API,
  isApiSuccess,
  parseUserFromApi,
  toProfileUpdatePayload,
  type ProfileUpdateApiResponse,
} from "@/lib/authApi";
import type { RegisteredUserProfile } from "@/types/app";

const EMPTY_PROFILE: RegisteredUserProfile = {
  username: "",
  firstName: "",
  lastName: "",
  companyEmail: "",
  companyName: "",
};

export default function ProfilePage() {
  const router = useRouter();
  const { userProfile, updateUserProfile } = useApp();
  const [form, setForm] = useState<RegisteredUserProfile>(userProfile ?? EMPTY_PROFILE);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm(userProfile ?? EMPTY_PROFILE);
  }, [userProfile]);

  function updateField<K extends keyof RegisteredUserProfile>(
    key: K,
    value: RegisteredUserProfile[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const normalized: RegisteredUserProfile = {
      username: form.username.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      companyEmail: form.companyEmail.trim().toLowerCase(),
      companyName: form.companyName.trim(),
    };

    if (
      !normalized.username ||
      !normalized.firstName ||
      !normalized.lastName ||
      !normalized.companyEmail ||
      !normalized.companyName
    ) {
      setError("All profile fields are required.");
      return;
    }

    if (!normalized.companyEmail.includes("@")) {
      setError("Enter a valid company email.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(AUTH_API.profileUpdate, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toProfileUpdatePayload(normalized)),
      });

      if (!response.ok) {
        setError("Profile update request failed. Please try again.");
        return;
      }

      const data = (await response.json()) as ProfileUpdateApiResponse;

      if (!isApiSuccess(data)) {
        setError(data.message ?? "Profile update failed.");
        return;
      }

      const updatedProfile = parseUserFromApi(data.user) ?? normalized;
      updateUserProfile(updatedProfile);
      setSuccess(data.message ?? "Profile updated successfully.");
      router.refresh();
    } catch {
      setError("Unable to reach profile update server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="card p-6 sm:p-8">
        <h2 className="font-reglo text-2xl font-bold text-gray-900">Edit Profile</h2>
        <p className="mt-1 text-base text-gray-500">
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
{error ? <p className="text-xs text-red-500">{error}</p> : null}
          {success ? <p className="text-xs text-emerald-600">{success}</p> : null}

          <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
