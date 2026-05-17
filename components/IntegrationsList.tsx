"use client";

import { Building2, Database, Ghost, Mail, Send, Target, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useApp } from "@/context/AppContext";
import type { Integration, IntegrationIconName } from "@/types/app";

const ICON_MAP: Record<IntegrationIconName, LucideIcon> = {
  database: Database,
  target: Target,
  mail: Mail,
  "building-2": Building2,
  users: Users,
  send: Send,
  ghost: Ghost,
};

function IntegrationRow({
  integration,
  showDetails = false,
}: {
  integration: Integration;
  showDetails?: boolean;
}) {
  const { toggleIntegration } = useApp();
  const Icon = ICON_MAP[integration.icon] || Database;

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-b-0">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: integration.color }}
      >
        <Icon size={16} style={{ color: integration.iconColor }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{integration.name}</p>
        <p className={`text-xs ${integration.connected ? "text-emerald-600" : "text-gray-400"}`}>
          {integration.connected ? "Connected" : "Disconnected"}
        </p>
      </div>

      {showDetails && integration.connected && (
        <span className="text-[10px] text-gray-300 mr-1 font-mono">Active</span>
      )}

      <label className="toggle-track" aria-label={`Toggle ${integration.name}`}>
        <input
          type="checkbox"
          checked={integration.connected}
          onChange={() => toggleIntegration(integration.key)}
        />
        <span className="toggle-thumb" />
      </label>
    </div>
  );
}

export default function IntegrationsList({ showDetails = false }: { showDetails?: boolean }) {
  const { integrations } = useApp();

  return (
    <div>
      {integrations.map((integration) => (
        <IntegrationRow key={integration.key} integration={integration} showDetails={showDetails} />
      ))}
    </div>
  );
}
