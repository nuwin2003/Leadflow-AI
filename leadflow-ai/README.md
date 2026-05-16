# LeadFlow AI - Next.js Dashboard

Universal B2B Sales Automation dashboard, migrated to a clean Next.js App Router + TypeScript structure.

## Stack

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Charts: Recharts
- Icons: Lucide React
- State: React Context API

## Quick Start

```bash
cd leadflow-ai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run start` - start production server
- `npm run lint` - run Next.js lint checks

## Project Structure

```
app/
  layout.tsx
  globals.css
  providers.tsx
  page.tsx
  (dashboard)/
    layout.tsx
    page.tsx
    leads/page.tsx
    campaigns/page.tsx
    integrations/page.tsx
    analytics/page.tsx
    config/page.tsx
    admin/page.tsx

components/
  AppShell.tsx
  Sidebar.tsx
  Topbar.tsx
  CampaignTable.tsx
  IntegrationsList.tsx
  GaugeChart.tsx

context/AppContext.tsx
data/mockData.ts
types/app.ts
utils/helpers.tsx
```

## Notes

- The old Vite files and build output were removed.
- Route navigation now uses Next.js App Router paths.
- Shared app state remains in `AppContext`, now fully typed.
