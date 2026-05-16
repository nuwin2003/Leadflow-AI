export type AppPageId =
  | "dashboard"
  | "import"
  | "leads"
  | "campaigns"
  | "integrations"
  | "analytics"
  | "config"
  | "admin";

export type ViewMode = "user" | "admin";

export type LeadStatus =
  | "ready_to_email"
  | "email_sent"
  | "deduplicating"
  | "replied"
  | "duplicate"
  | "paused"
  | "active"
  | "idle"
  | "error";

export type IntegrationIconName =
  | "database"
  | "target"
  | "mail"
  | "building-2"
  | "users"
  | "send"
  | "ghost";

export type SourceType =
  | "mock_linkedin"
  | "facebook_lead"
  | "csv_upload"
  | "webhook_api";

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  company: string;
  industry: string;
  companyDomain: string;
  source: SourceType;
  status: LeadStatus;
  confidence: number;
  enriched: boolean;
  dedupHash: string;
  isMockData: boolean;
  createdAt: string;
}

export interface RegisteredUserProfile {
  firstName: string;
  lastName: string;
  companyEmail: string;
  companyName: string;
}

export interface Campaign {
  id: number;
  name: string;
  source: string;
  status: LeadStatus;
  leads: number;
  sent: number;
  openRate: number;
  replyRate: number;
  campaign_id: string;
}

export interface AdminCampaign {
  tenant: string;
  name: string;
  status: LeadStatus;
  leads: number;
}

export interface Integration {
  key: string;
  name: string;
  icon: IntegrationIconName;
  color: string;
  iconColor: string;
  connected: boolean;
}

export interface TenantConfig {
  label: string;
  used: number;
  max: number;
}

export interface TrendData {
  labels: string[];
  values: number[];
}

export interface ErrorLogEntry {
  time: string;
  workflow: string;
  code: string;
  tenant: string;
  open: boolean;
}

export interface WebhookEntry {
  name: string;
  trigger: string;
  status: LeadStatus;
}
