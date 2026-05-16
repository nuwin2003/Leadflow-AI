import type {
  AdminCampaign,
  Campaign,
  ErrorLogEntry,
  Integration,
  Lead,
  SourceType,
  TenantConfig,
  TrendData,
  WebhookEntry,
} from "@/types/app";

function seeded(n: number): number {
  const x = n * 9301 + 49297;
  return (x % 233280) / 233280;
}

const FIRST_NAMES = [
  "Sarah",
  "James",
  "Priya",
  "Marcus",
  "Elena",
  "David",
  "Aisha",
  "Thomas",
  "Min",
  "Rachel",
  "Omar",
  "Yuki",
];
const LAST_NAMES = [
  "Chen",
  "Rodriguez",
  "Patel",
  "Johnson",
  "Kimura",
  "Lee",
  "Okafor",
  "Muller",
  "Singh",
  "Dubois",
  "Kim",
  "Torres",
];
const TITLES = [
  "VP Engineering",
  "CTO",
  "Head of Product",
  "Director of Engineering",
  "VP Sales",
  "CPO",
  "CRO",
  "Head of Growth",
];
const COMPANIES = [
  "TechCorp",
  "NexaSoft",
  "CloudBase",
  "Stackify",
  "Devly",
  "Growlio",
  "PivotBase",
  "SyncLabs",
  "Launchpad",
  "Orbita",
];
const INDUSTRIES = [
  "SaaS",
  "FinTech",
  "HealthTech",
  "EdTech",
  "E-commerce",
  "PropTech",
  "LegalTech",
];
const SOURCES: SourceType[] = [
  "mock_linkedin",
  "facebook_lead",
  "csv_upload",
  "webhook_api",
];
const STATUSES: Lead["status"][] = [
  "ready_to_email",
  "email_sent",
  "email_sent",
  "replied",
  "duplicate",
];

export const SEED_LEADS: Lead[] = Array.from({ length: 50 }, (_, i) => {
  const fn = FIRST_NAMES[Math.floor(seeded(i * 7) * FIRST_NAMES.length)];
  const ln = LAST_NAMES[Math.floor(seeded(i * 13) * LAST_NAMES.length)];
  const co = COMPANIES[Math.floor(seeded(i * 19) * COMPANIES.length)];
  const domain = `${co.toLowerCase().replace(/\s+/g, "")}.io`;
  return {
    id: `lead_seed_${String(i).padStart(3, "0")}`,
    firstName: fn,
    lastName: ln,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${domain}`,
    title: TITLES[Math.floor(seeded(i * 11) * TITLES.length)],
    company: co,
    industry: INDUSTRIES[Math.floor(seeded(i * 29) * INDUSTRIES.length)],
    companyDomain: domain,
    source: SOURCES[Math.floor(seeded(i * 17) * SOURCES.length)],
    status: STATUSES[Math.floor(seeded(i * 23) * STATUSES.length)],
    confidence: Math.floor(seeded(i * 31) * 40 + 60),
    enriched: seeded(i * 37) > 0.3,
    dedupHash: `sha256_mock_${String(i).padStart(3, "0")}`,
    isMockData: true,
    createdAt: new Date(
      Date.now() - Math.floor(seeded(i * 41) * 30 * 86400000),
    ).toISOString(),
  };
});

export const CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    name: "Q3 LinkedIn Outbound",
    source: "LinkedIn",
    status: "email_sent",
    leads: 196,
    sent: 180,
    openRate: 34,
    replyRate: 8,
    campaign_id: "camp_001",
  },
  {
    id: 2,
    name: "Facebook Tech Leaders",
    source: "Facebook",
    status: "deduplicating",
    leads: 63,
    sent: 40,
    openRate: 28,
    replyRate: 5,
    campaign_id: "camp_002",
  },
  {
    id: 3,
    name: "CSV Warm Import",
    source: "CSV Upload",
    status: "deduplicating",
    leads: 26,
    sent: 10,
    openRate: 22,
    replyRate: 3,
    campaign_id: "camp_003",
  },
  {
    id: 4,
    name: "Webhook API Leads",
    source: "Webhook/API",
    status: "email_sent",
    leads: 18,
    sent: 18,
    openRate: 39,
    replyRate: 11,
    campaign_id: "camp_004",
  },
];

export const ADMIN_CAMPAIGNS: AdminCampaign[] = [
  {
    tenant: "client_001",
    name: "TechCorp Q3 Outbound",
    status: "email_sent",
    leads: 196,
  },
  {
    tenant: "client_001",
    name: "TechCorp Product Launch",
    status: "deduplicating",
    leads: 63,
  },
  {
    tenant: "client_002",
    name: "NexaSoft Dev Targeting",
    status: "paused",
    leads: 88,
  },
  {
    tenant: "client_002",
    name: "NexaSoft EU Expansion",
    status: "email_sent",
    leads: 112,
  },
  {
    tenant: "client_003",
    name: "CloudBase Growth Sprint",
    status: "email_sent",
    leads: 45,
  },
];

export const INTEGRATIONS_DEFAULT: Integration[] = [
  {
    key: "n8n_airtable",
    name: "n8n Airtable",
    icon: "database",
    color: "#FAEEDA",
    iconColor: "#854F0B",
    connected: true,
  },
  {
    key: "hunter",
    name: "Hunter.io",
    icon: "target",
    color: "#FAEEDA",
    iconColor: "#854F0B",
    connected: true,
  },
  {
    key: "gmail",
    name: "Gmail",
    icon: "mail",
    color: "#FCEBEB",
    iconColor: "#A32D2D",
    connected: true,
  },
  {
    key: "clearbit",
    name: "Clearbit",
    icon: "building-2",
    color: "#E6F1FB",
    iconColor: "#185FA5",
    connected: true,
  },
  {
    key: "facebook",
    name: "Facebook Ads",
    icon: "users",
    color: "#E6F1FB",
    iconColor: "#185FA5",
    connected: true,
  },
  {
    key: "sendgrid",
    name: "SendGrid",
    icon: "send",
    color: "#E1F5EE",
    iconColor: "#0F6E56",
    connected: false,
  },
  {
    key: "phantombuster",
    name: "Phantombuster",
    icon: "ghost",
    color: "#EEEDFE",
    iconColor: "#534AB7",
    connected: false,
  },
];

export const TENANT_CONFIGS: Record<string, TenantConfig> = {
  all: { label: "Unlimited Users (All)", used: 50, max: 100 },
  client_001: { label: "client_001 - TechCorp", used: 50, max: 100 },
  client_002: { label: "client_002 - NexaSoft", used: 72, max: 150 },
  client_003: { label: "client_003 - CloudBase", used: 15, max: 50 },
};

export const TREND_DATA: TrendData = {
  labels: ["May 3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"],
  values: [22, 35, 41, 38, 50, 47, 30, 45, 48, 50, 42, 49, 50, 48],
};

export const ERROR_LOG: ErrorLogEntry[] = [
  {
    time: "09:14 AM",
    workflow: "LinkedIn Sourcing",
    code: "API_RATE_LIMIT",
    tenant: "client_002",
    open: true,
  },
  {
    time: "08:52 AM",
    workflow: "Email Send",
    code: "SMTP_AUTH_FAIL",
    tenant: "client_003",
    open: true,
  },
  {
    time: "Yesterday",
    workflow: "Enrichment",
    code: "CLEARBIT_QUOTA",
    tenant: "client_001",
    open: false,
  },
  {
    time: "Yesterday",
    workflow: "FB Sourcing",
    code: "TOKEN_EXPIRED",
    tenant: "client_002",
    open: false,
  },
];

export const WEBHOOKS: WebhookEntry[] = [
  { name: "FB Lead Ads", trigger: "New form submit", status: "active" },
  { name: "Unsubscribe", trigger: "Opt-out click", status: "active" },
  { name: "Email Open/Click", trigger: "SendGrid event", status: "active" },
  { name: "CRM Push", trigger: "After email sent", status: "idle" },
];
