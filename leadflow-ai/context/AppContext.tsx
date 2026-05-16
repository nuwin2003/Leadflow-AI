"use client";

import { createContext, useContext, useMemo, useState } from "react";

import { INTEGRATIONS_DEFAULT, TENANT_CONFIGS } from "@/data/mockData";
import type { Integration, TenantConfig, ViewMode } from "@/types/app";

interface AppContextValue {
  currentTenant: string;
  setCurrentTenant: (tenant: string) => void;
  tenantConfig: TenantConfig;
  viewMode: ViewMode;
  switchView: (mode: ViewMode) => void;
  integrations: Integration[];
  toggleIntegration: (key: string) => void;
  dailyLimit: number;
  setDailyLimit: (value: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("user");
  const [integrations, setIntegrations] =
    useState<Integration[]>(INTEGRATIONS_DEFAULT);
  const [dailyLimit, setDailyLimit] = useState<number>(50);

  const tenantConfig = TENANT_CONFIGS[currentTenant] || TENANT_CONFIGS.all;

  function toggleIntegration(key: string) {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, connected: !item.connected } : item,
      ),
    );
  }

  function switchView(mode: ViewMode) {
    setViewMode(mode);
  }

  const value = useMemo<AppContextValue>(
    () => ({
      currentTenant,
      setCurrentTenant,
      tenantConfig,
      viewMode,
      switchView,
      integrations,
      toggleIntegration,
      dailyLimit,
      setDailyLimit,
    }),
    [currentTenant, tenantConfig, viewMode, integrations, dailyLimit],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppProvider");
  }
  return ctx;
}
