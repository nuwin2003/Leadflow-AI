# LeadFlow AI — Dashboard

Universal B2B Sales Automation | Built for the n8n Hackathon

## Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Charts | Recharts |
| Icons | Lucide React |
| State | React Context API |

## Quick Start

```bash
cd leadflow-ai
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
src/
├── main.jsx                  # React entry point
├── App.jsx                   # Shell layout + page router
├── index.css                 # Tailwind + global component styles
│
├── context/
│   └── AppContext.jsx         # Global state (tenant, nav, integrations)
│
├── data/
│   └── mockData.js            # Seed leads, campaigns, integrations, error log
│
├── utils/
│   └── helpers.jsx            # StatusBadge, formatters
│
├── components/
│   ├── Sidebar.jsx            # Left navigation
│   ├── Topbar.jsx             # Header bar + view toggle
│   ├── CampaignTable.jsx      # ★ Reusable campaign table (compact + full)
│   ├── IntegrationsList.jsx   # Toggle rows for each integration
│   └── GaugeChart.jsx         # Canvas semi-circle gauge
│
└── pages/
    ├── DashboardPage.jsx      # Home — KPIs, campaigns, gauge, integrations
    ├── LeadsPage.jsx          # Searchable lead table (50 seed leads)
    ├── CampaignsPage.jsx      # Full campaign CRUD view
    ├── IntegrationsPage.jsx   # Services, webhooks, rate limits
    ├── AnalyticsPage.jsx      # Recharts area chart + status breakdown
    ├── ConfigPage.jsx         # API credentials (secret fields), tag inputs
    └── AdminPage.jsx          # Super-admin: all tenants, error log
```

## Key Features

### User Dashboard
- **Lead Summary** — total leads, weekly additions, campaign sources, n8n workflow count
- **Multi-Tenant Config** — dropdown switches tenant; gauge updates to that tenant's send limit
- **Active Campaigns** — status badges (Email Sent / Deduplicating / Paused)
- **Integrations** — live toggle switches for n8n/Airtable, Hunter.io, Gmail, Clearbit, Facebook
- **Daily Send Limit** — Canvas semi-circle gauge, updates per tenant

### Leads Page
- Searchable + filterable table of 50 deterministic seed leads
- Shows: name, title, company, email (monospace), confidence score (≥80% green), source, status badge, enrichment tick, date added

### Campaigns Page
- Full table: name, source, status, leads, sent, open rate, reply rate
- Inline edit drawer on row click

### Integrations Page
- Toggle panel + webhook endpoint table + rate limit reference table

### Analytics Page
- Recharts area chart — emails sent over last 14 days
- KPI cards: open rate, reply rate, bounce rate
- Lead status breakdown bar chart

### User Config Page
- Secret credential fields (Show/Hide toggle per field — never plaintext by default)
- Tag inputs for job titles, industries, geographies
- Daily send limit slider
- n8n workflow settings (cron, dedup strategy)

### Super Admin Page
- Platform-wide KPIs (tenants, campaigns, volume, error rate)
- All campaigns across all tenants in one table
- Global error log with open/closed status indicators
- Tenant management table (View / Suspend actions)

## Architecture Notes

### Multi-Tenant Config (Context API)
`AppContext.jsx` holds `currentTenant` state. All pages read from context — switching
the tenant dropdown on the Dashboard updates the gauge and (in production) would
re-fetch Airtable records for that tenant's config.

### n8n Integration Pattern
In production, every toggle in the Integrations panel should `PATCH` the corresponding
Airtable config record. Your n8n workflows poll this config at runtime, so no
workflow code changes are needed per tenant.

### Secret Fields
`ConfigPage.jsx` renders credential inputs as `type="password"` by default.
A Show/Hide button flips visibility. Keys should be sent via `PATCH` to your
Airtable config API — never logged or displayed after saving.

### Seed Data
`mockData.js` uses a deterministic `seeded()` function (no `Math.random()`) so
the 50 lead records are identical across renders and sessions. Replace with
real Airtable API calls when moving to production.
