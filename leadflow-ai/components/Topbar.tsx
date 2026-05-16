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
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-[15px] font-semibold text-gray-900 leading-tight">{title}</h1>
        <p className="text-[11px] text-gray-400">Universal B2B Sales Automation · Version 1.0.0</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
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
