"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, Play } from "lucide-react";

import { useApp } from "@/context/AppContext";
import type { ViewMode } from "@/types/app";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/leads": "Leads",
  "/campaigns": "Campaigns",
  "/integrations": "Integrations",
  "/analytics": "Analytics",
  "/config": "User Configuration",
  "/admin": "Super Admin",
};

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { viewMode, switchView } = useApp();
  const title = PAGE_TITLES[pathname] ?? "LeadFlow AI";

  function handleMode(mode: ViewMode) {
    switchView(mode);
    router.push(mode === "admin" ? "/admin" : "/");
  }

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-[15px] font-semibold text-gray-900 leading-tight">{title}</h1>
        <p className="text-[11px] text-gray-400">Universal B2B Sales Automation · Version 1.0.0</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
          {(["user", "admin"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => handleMode(mode)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                viewMode === mode
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {mode === "admin" ? "Super Admin" : "User"}
            </button>
          ))}
        </div>

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
