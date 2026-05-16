"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";

import CampaignTable from "@/components/CampaignTable";
import GaugeChart from "@/components/GaugeChart";
import IntegrationsList from "@/components/IntegrationsList";
import { CAMPAIGNS, TENANT_CONFIGS } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import { AUTH_API, parseEmailLogsFromApi } from "@/lib/authApi";
import type { EmailLogEntry } from "@/types/app";

function MetricCard({
  label,
  value,
  sub,
  subColor = "text-gray-400",
}: {
  label: string;
  value: string;
  sub: string;
  subColor?: string;
}) {
  return (
    <div className="metric-card">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      <p className={`metric-sub ${subColor}`}>{sub}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { currentTenant, hasCompletedCsvImport, setCurrentTenant, leads } = useApp();
  const tenantCfg = TENANT_CONFIGS[currentTenant] || TENANT_CONFIGS.all;
  const csvLeadCount = leads.filter((lead) => lead.source === "csv_upload").length;
  const weeklyLeads = Math.min(leads.length, 50);
  const hasData = hasCompletedCsvImport && leads.length > 0;
  const [historyLogs, setHistoryLogs] = useState<EmailLogEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");

  const sortedHistoryLogs = useMemo(
    () =>
      [...historyLogs].sort(
        (a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime(),
      ),
    [historyLogs],
  );

  useEffect(() => {
    let active = true;

    async function fetchHistoryLogs() {
      setHistoryLoading(true);
      setHistoryError("");
      try {
        const response = await fetch(AUTH_API.emailLogs, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch logs (${response.status})`);
        }

        const data = (await response.json()) as unknown;
        const parsed = parseEmailLogsFromApi(data);
        if (active) {
          setHistoryLogs(parsed);
        }
      } catch {
        if (active) {
          setHistoryError("Unable to load history logs right now.");
        }
      } finally {
        if (active) {
          setHistoryLoading(false);
        }
      }
    }

    fetchHistoryLogs();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <MetricCard
          label="Total Leads"
          value={String(leads.length)}
          sub={hasData ? "all campaigns" : "upload CSV to populate"}
        />
        <MetricCard
          label="Weekly Additions"
          value={`+${weeklyLeads}`}
          sub={hasData ? "added this week" : "no imported data"}
          subColor="text-emerald-500"
        />
        <MetricCard
          label="CSV Imported Leads"
          value={String(csvLeadCount)}
          sub={csvLeadCount > 0 ? "from onboarding upload" : "none imported yet"}
        />
        <MetricCard label="n8n Workflows" value="8" sub="7 active · 1 paused" />
      </div>

      {!hasData ? (
        <div className="card p-5">
          <h2 className="card-title">No lead data yet</h2>
          <p className="mt-1 text-sm text-gray-500">
            Upload and submit a CSV in the Import CSV section to populate dashboard tables.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr 272px" }}>
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="card-title">Active Campaigns</h2>
            <Link className="btn btn-primary btn-sm gap-1" href="/campaigns">
              <Plus size={12} /> New
            </Link>
          </div>
          <CampaignTable campaigns={CAMPAIGNS} compact />
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="card-title">Multi-Tenant Config</h2>
            <button className="btn-icon p-1" aria-label="Options">
              <MoreHorizontal size={14} />
            </button>
          </div>

          <div className="mb-4">
            <label className="form-label">Select User / Tenant</label>
            <div className="relative">
              <select
                className="form-select pr-8"
                value={currentTenant}
                onChange={(e) => setCurrentTenant(e.target.value)}
              >
                {Object.entries(TENANT_CONFIGS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                ▼
              </span>
            </div>
          </div>

          <div className="border-t border-gray-50 pt-4">
            <p className="card-title mb-3">Daily Send Limit</p>
            <GaugeChart used={tenantCfg.used} max={tenantCfg.max} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="card-title">Integrations</h2>
            <button className="btn-icon p-1" aria-label="Options">
              <MoreHorizontal size={14} />
            </button>
          </div>
          <IntegrationsList />
        </div>
      </div>

      <div className="card overflow-x-auto p-0">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div>
            <h2 className="card-title">History Logs</h2>
            <p className="text-xs text-gray-400">Fetched from n8n email log webhook</p>
          </div>
          <span className="text-xs text-gray-400">
            {historyLoading ? "Loading..." : `${sortedHistoryLogs.length} records`}
          </span>
        </div>

        {historyError ? <p className="px-4 py-4 text-sm text-red-500">{historyError}</p> : null}

        {!historyError ? (
          <table className="data-table">
            <thead>
              <tr>
                <th className="pl-4">Created</th>
                <th>Status</th>
                <th>To</th>
                <th>Subject</th>
                <th>Workflow</th>
                <th>Sent At</th>
                <th>Opened At</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {historyLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400">
                    Loading history logs...
                  </td>
                </tr>
              ) : sortedHistoryLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-300">
                    No history logs found.
                  </td>
                </tr>
              ) : (
                sortedHistoryLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="pl-4 font-mono text-xs text-gray-500">
                      {new Date(log.createdTime).toLocaleString()}
                    </td>
                    <td className="font-medium">{log.status}</td>
                    <td className="text-xs text-gray-500">{log.toEmail || "-"}</td>
                    <td>{log.subject || "-"}</td>
                    <td>{log.workflowName || "-"}</td>
                    <td className="text-xs text-gray-500">
                      {log.sentAt ? new Date(log.sentAt).toLocaleString() : "-"}
                    </td>
                    <td className="text-xs text-gray-500">
                      {log.openedAt ? new Date(log.openedAt).toLocaleString() : "-"}
                    </td>
                    <td className="max-w-[320px] truncate text-xs text-red-500">
                      {log.errorMessage || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
}
