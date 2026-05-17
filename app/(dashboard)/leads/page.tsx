"use client";

import { useMemo, useState } from "react";
import { Check, Download, Search, X } from "lucide-react";

import { useApp } from "@/context/AppContext";
import { fmtDate, fmtSource, StatusBadge } from "@/utils/helpers";

export default function LeadsPage() {
  const { hasCompletedCsvImport, leads } = useApp();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");

  const filtered = useMemo(() => {
    if (!hasCompletedCsvImport) return [];
    const q = query.toLowerCase();
    return leads.filter((lead) => {
      const matchQ =
        !q ||
        [lead.firstName, lead.lastName, lead.company, lead.email, lead.title]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const matchS = !status || lead.status === status;
      const matchSrc = !source || lead.source === source;
      return matchQ && matchS && matchSrc;
    });
  }, [hasCompletedCsvImport, leads, query, source, status]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Lead Database</h2>
          <p className="text-xs text-gray-400">
            {hasCompletedCsvImport ? `${filtered.length} of ${leads.length} leads` : "0 leads"}
          </p>
        </div>
        <button className="btn gap-1.5">
          <Download size={13} /> Export CSV
        </button>
      </div>

      <div className="flex gap-2">
        <div className="search-bar flex-1">
          <Search size={14} className="text-gray-300 flex-shrink-0" />
          <input
            placeholder="Search by name, company, email, title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <select className="form-select w-44" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="ready_to_email">Ready to Email</option>
            <option value="email_sent">Email Sent</option>
            <option value="replied">Replied</option>
            <option value="duplicate">Duplicate</option>
          </select>
        </div>
        <div className="relative">
          <select className="form-select w-44" value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">All Sources</option>
            <option value="mock_linkedin">LinkedIn</option>
            <option value="facebook_lead">Facebook</option>
            <option value="csv_upload">CSV Upload</option>
            <option value="webhook_api">Webhook/API</option>
          </select>
        </div>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th className="pl-4">Company Name</th>
              <th>Company Email</th>
              <th className="text-center">Conf.</th>
              <th>Source</th>
              <th>Status</th>
              <th className="text-center">Enriched</th>
              <th>Added</th>
            </tr>
          </thead>
          <tbody>
            {!hasCompletedCsvImport && (
              <tr>
                <td colSpan={7} className="text-center text-gray-300 py-10">
                  No leads yet. Upload and submit your CSV in the Import CSV section.
                </td>
              </tr>
            )}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-300 py-10">
                  No leads match your filters.
                </td>
              </tr>
            )}
            {hasCompletedCsvImport &&
              filtered.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <span className="font-medium text-gray-700">{lead.company}</span>
                </td>
                <td>
                  <span className="font-mono text-xs text-gray-500">{lead.email}</span>
                </td>
                <td className="text-center">
                  <span
                    className={`text-xs font-semibold ${
                      lead.confidence >= 80 ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {lead.confidence}%
                  </span>
                </td>
                <td>
                  <span className="text-xs text-gray-400 capitalize">{fmtSource(lead.source)}</span>
                </td>
                <td>
                  <StatusBadge status={lead.status} />
                </td>
                <td className="text-center">
                  {lead.enriched ? (
                    <Check size={14} className="text-emerald-500 mx-auto" />
                  ) : (
                    <X size={14} className="text-red-300 mx-auto" />
                  )}
                </td>
                <td className="text-xs text-gray-400">{fmtDate(lead.createdAt)}</td>
              </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
