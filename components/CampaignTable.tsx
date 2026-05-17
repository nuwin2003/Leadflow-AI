import { ExternalLink, MoreHorizontal } from "lucide-react";

import type { Campaign } from "@/types/app";
import { StatusBadge } from "@/utils/helpers";

interface CampaignTableProps {
  campaigns?: Campaign[];
  compact?: boolean;
  onEdit?: (campaign: Campaign) => void;
}

export default function CampaignTable({
  campaigns = [],
  compact = false,
  onEdit,
}: CampaignTableProps) {
  if (!campaigns.length) {
    return <div className="text-center py-10 text-gray-300 text-sm">No campaigns found.</div>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Campaign</th>
          {!compact && <th>Source</th>}
          <th>Status</th>
          <th className="text-right">Leads</th>
          {!compact && <th className="text-right">Sent</th>}
          {!compact && <th className="text-right">Open Rate</th>}
          {!compact && <th className="text-right">Reply Rate</th>}
          {!compact && <th className="text-right">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {campaigns.map((campaign) => (
          <tr key={campaign.id}>
            <td className="font-medium text-gray-800">{campaign.name}</td>
            {!compact && <td className="text-gray-400 text-xs">{campaign.source}</td>}
            <td>
              <StatusBadge status={campaign.status} />
            </td>
            <td className="text-right font-medium">{campaign.leads}</td>
            {!compact && <td className="text-right text-gray-500">{campaign.sent}</td>}
            {!compact && (
              <td className="text-right">
                <span
                  className={
                    campaign.openRate >= 30 ? "text-emerald-600 font-medium" : "text-gray-500"
                  }
                >
                  {campaign.openRate}%
                </span>
              </td>
            )}
            {!compact && (
              <td className="text-right">
                <span
                  className={
                    campaign.replyRate >= 8 ? "text-emerald-600 font-medium" : "text-gray-500"
                  }
                >
                  {campaign.replyRate}%
                </span>
              </td>
            )}
            {!compact && (
              <td className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => onEdit?.(campaign)} className="btn btn-sm">
                    Edit
                  </button>
                  <button className="btn btn-sm btn-icon p-1.5">
                    <ExternalLink size={12} />
                  </button>
                  <button className="btn btn-sm btn-icon p-1.5">
                    <MoreHorizontal size={12} />
                  </button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
