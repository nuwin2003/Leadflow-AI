import React from 'react'
import { MoreHorizontal, ExternalLink } from 'lucide-react'
import { StatusBadge } from '../utils/helpers'

/**
 * CampaignTable — reusable campaign listing component.
 *
 * Props:
 *   campaigns  — array of campaign objects
 *   compact    — bool: show compact (dashboard) vs full (campaigns page) view
 *   onEdit     — callback(campaign) when edit is clicked
 */
export default function CampaignTable({ campaigns = [], compact = false, onEdit }) {
  if (!campaigns.length) {
    return (
      <div className="text-center py-10 text-gray-300 text-sm">
        No campaigns found.
      </div>
    )
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
        {campaigns.map(c => (
          <tr key={c.id}>
            <td className="font-medium text-gray-800">{c.name}</td>
            {!compact && (
              <td className="text-gray-400 text-xs">{c.source}</td>
            )}
            <td><StatusBadge status={c.status} /></td>
            <td className="text-right font-medium">{c.leads}</td>
            {!compact && <td className="text-right text-gray-500">{c.sent}</td>}
            {!compact && (
              <td className="text-right">
                <span className={c.openRate >= 30 ? 'text-emerald-600 font-medium' : 'text-gray-500'}>
                  {c.openRate}%
                </span>
              </td>
            )}
            {!compact && (
              <td className="text-right">
                <span className={c.replyRate >= 8 ? 'text-emerald-600 font-medium' : 'text-gray-500'}>
                  {c.replyRate}%
                </span>
              </td>
            )}
            {!compact && (
              <td className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit?.(c)}
                    className="btn btn-sm"
                  >
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
  )
}
