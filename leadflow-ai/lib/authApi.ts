import type { EmailLogEntry, RegisteredUserProfile } from "@/types/app";

const N8N_BASE = "https://nuwin2003.app.n8n.cloud/webhook";

export const AUTH_API = {
  signup: `${N8N_BASE}/auth/signup`,
  login: `${N8N_BASE}/auth/login`,
  profileUpdate: `${N8N_BASE}/user/update`,
  emailLogs: `${N8N_BASE}/email-logs`,
} as const;

export interface LoginApiResponse {
  success?: string | boolean;
  status?: string;
  message?: string;
  user?: {
    username?: string;
    email?: string;
    companyName?: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface ProfileUpdateApiResponse {
  success?: string | boolean;
  status?: string;
  message?: string;
  user?: LoginApiResponse["user"];
}

export function isApiSuccess(data: { success?: string | boolean; status?: string }): boolean {
  if (data.success === true || data.success === "true" || data.success === "success") {
    return true;
  }
  return data.status === "success";
}

export function parseUserFromApi(raw: LoginApiResponse["user"]): RegisteredUserProfile | null {
  if (!raw) return null;

  const profile: RegisteredUserProfile = {
    username: String(raw.username ?? "").trim(),
    firstName: String(raw.firstName ?? "").trim(),
    lastName: String(raw.lastName ?? "").trim(),
    companyEmail: String(raw.email ?? "").trim().toLowerCase(),
    companyName: String(raw.companyName ?? "").trim(),
  };

  if (
    !profile.username ||
    !profile.firstName ||
    !profile.lastName ||
    !profile.companyEmail ||
    !profile.companyName
  ) {
    return null;
  }

  return profile;
}

export function toProfileUpdatePayload(profile: RegisteredUserProfile) {
  return {
    username: profile.username,
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.companyEmail,
    companyName: profile.companyName,
  };
}

export function sanitizeStoredProfile(
  profile: RegisteredUserProfile & { password?: string } | null,
): RegisteredUserProfile | null {
  if (!profile) return null;
  const { password: _password, ...safe } = profile;
  return safe;
}

interface EmailLogApiItem {
  id?: string;
  createdTime?: string;
  fields?: {
    status?: string;
    sentAt?: string;
    to_email?: string;
    subject?: string;
    openedAt?: string;
    workflow_name?: string;
    error_msg?: string;
    url?: string;
  };
}

export function parseEmailLogsFromApi(raw: unknown): EmailLogEntry[] {
  if (!Array.isArray(raw)) return [];

  const parsed: EmailLogEntry[] = [];

  for (const item of raw) {
    const row = item as EmailLogApiItem;
    const fields = row.fields ?? {};
    const id = String(row.id ?? "").trim();
    const createdTime = String(row.createdTime ?? "").trim();

    if (!id || !createdTime) continue;

    const entry: EmailLogEntry = {
      id,
      createdTime,
      status: String(fields.status ?? "unknown"),
      toEmail: String(fields.to_email ?? ""),
      subject: String(fields.subject ?? ""),
    };

    if (fields.sentAt) entry.sentAt = fields.sentAt;
    if (fields.openedAt) entry.openedAt = fields.openedAt;
    if (fields.workflow_name) entry.workflowName = fields.workflow_name;
    if (fields.error_msg) entry.errorMessage = fields.error_msg;
    if (fields.url) entry.url = fields.url;

    parsed.push(entry);
  }

  return parsed;
}
