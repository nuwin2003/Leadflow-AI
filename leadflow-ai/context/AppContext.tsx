"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { INTEGRATIONS_DEFAULT, TENANT_CONFIGS } from "@/data/mockData";
import type {
  Integration,
  Lead,
  RegisteredUserProfile,
  TenantConfig,
} from "@/types/app";

const APP_STORAGE_KEY = "leadflow.app-state.v1";

interface PersistedAppState {
  userProfile: RegisteredUserProfile | null;
  isRegistered: boolean;
  isAuthenticated: boolean;
  hasCompletedCsvImport: boolean;
  importedLeads: Lead[];
}

const DEFAULT_PERSISTED_STATE: PersistedAppState = {
  userProfile: null,
  isRegistered: false,
  isAuthenticated: false,
  hasCompletedCsvImport: false,
  importedLeads: [],
};

interface AppContextValue {
  currentTenant: string;
  setCurrentTenant: (tenant: string) => void;
  tenantConfig: TenantConfig;
  integrations: Integration[];
  toggleIntegration: (key: string) => void;
  dailyLimit: number;
  setDailyLimit: (value: number) => void;
  userProfile: RegisteredUserProfile | null;
  isRegistered: boolean;
  isAuthenticated: boolean;
  hasCompletedCsvImport: boolean;
  isHydrated: boolean;
  leads: Lead[];
  pendingImportLeads: Lead[];
  registerUser: (profile: RegisteredUserProfile) => void;
  loginWithCredentials: (email: string, password: string) => { ok: boolean; error?: string };
  markAuthenticatedSession: () => void;
  logoutUser: () => void;
  updateUserProfile: (profile: RegisteredUserProfile) => void;
  setPendingImportLeads: (leads: Lead[]) => void;
  completeCsvImport: (leads: Lead[]) => void;
  clearCsvImport: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<string>("all");
  const [integrations, setIntegrations] =
    useState<Integration[]>(INTEGRATIONS_DEFAULT);
  const [dailyLimit, setDailyLimit] = useState<number>(50);
  const [persistedState, setPersistedState] =
    useState<PersistedAppState>(DEFAULT_PERSISTED_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  const tenantConfig = TENANT_CONFIGS[currentTenant] || TENANT_CONFIGS.all;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(APP_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as PersistedAppState;
        setPersistedState({
          userProfile: parsed.userProfile ?? null,
          isRegistered: parsed.isRegistered ?? false,
          isAuthenticated: parsed.isAuthenticated ?? false,
          hasCompletedCsvImport: parsed.hasCompletedCsvImport ?? false,
          importedLeads: Array.isArray(parsed.importedLeads) ? parsed.importedLeads : [],
        });
      } catch {
        setPersistedState(DEFAULT_PERSISTED_STATE);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) return;
    window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(persistedState));
  }, [persistedState, isHydrated]);

  function toggleIntegration(key: string) {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, connected: !item.connected } : item,
      ),
    );
  }

  function registerUser(profile: RegisteredUserProfile) {
    setPersistedState((prev) => ({
      ...prev,
      userProfile: profile,
      isRegistered: true,
      isAuthenticated: false,
    }));
  }

  function loginWithCredentials(
    email: string,
    password: string,
  ): { ok: boolean; error?: string } {
    const normalizedLogin = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    if (!normalizedLogin || !normalizedPassword) {
      return { ok: false, error: "Enter username/email and password." };
    }
    if (!persistedState.userProfile || !persistedState.isRegistered) {
      return { ok: false, error: "No registered user found. Please register first." };
    }
    const emailMatch = normalizedLogin === persistedState.userProfile.companyEmail.toLowerCase();
    const usernameMatch = normalizedLogin === persistedState.userProfile.username.toLowerCase();
    if (!emailMatch && !usernameMatch) {
      return { ok: false, error: "Username/email does not match registered account." };
    }
    if (normalizedPassword !== persistedState.userProfile.password) {
      return { ok: false, error: "Incorrect password." };
    }
    setPersistedState((prev) => ({ ...prev, isAuthenticated: true }));
    return { ok: true };
  }

  function markAuthenticatedSession() {
    setPersistedState((prev) => ({ ...prev, isAuthenticated: true }));
  }

  function logoutUser() {
    setPersistedState((prev) => ({ ...prev, isAuthenticated: false }));
  }

  function updateUserProfile(profile: RegisteredUserProfile) {
    setPersistedState((prev) => ({
      ...prev,
      userProfile: profile,
      isRegistered: true,
    }));
  }

  function setPendingImportLeads(leads: Lead[]) {
    setPersistedState((prev) => ({
      ...prev,
      importedLeads: leads,
      hasCompletedCsvImport: false,
    }));
  }

  function completeCsvImport(leads: Lead[]) {
    setPersistedState((prev) => ({
      ...prev,
      importedLeads: leads,
      hasCompletedCsvImport: true,
    }));
  }

  function clearCsvImport() {
    setPersistedState((prev) => ({
      ...prev,
      importedLeads: [],
      hasCompletedCsvImport: false,
    }));
  }

  const leads = persistedState.hasCompletedCsvImport ? persistedState.importedLeads : [];
  const pendingImportLeads = persistedState.importedLeads;

  const value = useMemo<AppContextValue>(
    () => ({
      currentTenant,
      setCurrentTenant,
      tenantConfig,
      integrations,
      toggleIntegration,
      dailyLimit,
      setDailyLimit,
      userProfile: persistedState.userProfile,
      isRegistered: persistedState.isRegistered,
      isAuthenticated: persistedState.isAuthenticated,
      hasCompletedCsvImport: persistedState.hasCompletedCsvImport,
      isHydrated,
      leads,
      pendingImportLeads,
      registerUser,
      loginWithCredentials,
      markAuthenticatedSession,
      logoutUser,
      updateUserProfile,
      setPendingImportLeads,
      completeCsvImport,
      clearCsvImport,
    }),
    [
      currentTenant,
      tenantConfig,
      integrations,
      dailyLimit,
      persistedState,
      isHydrated,
      leads,
      pendingImportLeads,
    ],
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
