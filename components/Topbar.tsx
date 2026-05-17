"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, Play } from "lucide-react";

import { useApp } from "@/context/AppContext";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/import": "CSV Import",
  "/profile": "Edit Profile",
  "/leads": "Leads",
  "/campaigns": "Campaigns",
  "/integrations": "Integrations",
  "/analytics": "Analytics",
  "/config": "User Configuration",
};

export default function Topbar() {
  const pathname = usePathname();
  const { userProfile } = useApp();
  const title = PAGE_TITLES[pathname] ?? "LeadFlow AI";

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6">
      <div>
        <h1 className="font-reglo text-lg font-bold leading-tight text-gray-900">{title}</h1>
        <p className="text-sm text-gray-400">Universal B2B Sales Automation · Version 1.0.0</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">
          {userProfile?.companyName ?? "Client Workspace"}
        </span>

        <button className="btn-icon" aria-label="Notifications">
          <Bell size={15} />
        </button>

        <button className="btn btn-primary btn-sm gap-1.5" aria-label="Run workflow">
          <Play size={12} />
          Run Workflow
        </button>

      </div>
    </header>
  );
}
