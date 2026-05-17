"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import CampaignTable from "@/components/CampaignTable";
import { useApp } from "@/context/AppContext";
import type { Campaign } from "@/types/app";

export default function CampaignsPage() {
  const { leads } = useApp();
  const [campaigns] = useState<Campaign[]>(
    leads.slice(0, 20).map((lead, index) => ({
      id: index + 1,
      name: `${lead.company} Outreach`,
      source: lead.source.replace("_", " "),
      status: lead.status,
      leads: 1,
      sent: lead.status === "email_sent" ? 1 : 0,
      openRate: 0,
      replyRate: 0,
      campaign_id: `generated_${lead.id}`,
    })),
  );
  const [editing, setEditing] = useState<Campaign | null>(null);

  function handleEdit(campaign: Campaign) {
    setEditing(campaign);
  }

  function handleSave() {
    setEditing(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Campaigns</h2>
          <p className="text-xs text-gray-400">
            {campaigns.length} total · {campaigns.filter((c) => c.status === "email_sent").length} sending
          </p>
        </div>
        <button className="btn btn-primary gap-1.5">
          <Plus size={13} /> New Campaign
        </button>
      </div>

      {editing && (
        <div className="card border-brand-200 bg-brand-50/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Edit - {editing.name}</h3>
            <button className="btn btn-sm" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="form-label">Campaign Name</label>
              <input className="form-input" defaultValue={editing.name} />
            </div>
            <div>
              <label className="form-label">Source</label>
              <select className="form-select" defaultValue={editing.source}>
                {["LinkedIn", "Facebook", "CSV Upload", "Webhook/API"].map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Daily Send Limit</label>
              <input className="form-input" type="number" defaultValue={50} />
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      )}

      <div className="card p-0 overflow-x-auto">
        <CampaignTable campaigns={campaigns} compact={false} onEdit={handleEdit} />
      </div>
    </div>
  );
}
