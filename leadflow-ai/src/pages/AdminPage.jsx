import React from 'react'
import { ShieldCheck, AlertTriangle } from 'lucide-react'
import { ADMIN_CAMPAIGNS, ERROR_LOG } from '../data/mockData'
import { StatusBadge } from '../utils/helpers'

function GlobalMetric({ label, value, sub, subColor = 'text-gray-400' }) {
  return (
    <div className="metric-card">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      <p className={`metric-sub ${subColor}`}>{sub}</p>
    </div>
  )
}

export default function AdminPage() {
  const openErrors = ERROR_LOG.filter(e => e.open).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} className="text-brand-600" />
        <div>
          <h2 className="text-base font-semibold text-gray-800">Super Admin — Platform Overview</h2>
          <p className="text-xs text-gray-400">Global view across all tenants and campaigns</p>
        </div>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-4 gap-3">
        <GlobalMetric label="Total Tenants"     value="3"      sub="2 active · 1 trial"        />
        <GlobalMetric label="Global Campaigns"  value="12"     sub="across all users" subColor="text-emerald-500" />
        <GlobalMetric label="Emails Sent (7d)"  value="1,840"  sub="↑ 23% vs prior week" subColor="text-emerald-500" />
        <GlobalMetric label="Error Rate"        value="0.4%"   sub={`${openErrors} open errors`} subColor="text-red-400" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* All active campaigns */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="card-title">All Active Campaigns</h3>
            <span className="text-[10px] text-gray-300">{ADMIN_CAMPAIGNS.length} total</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Campaign</th>
                <th>Status</th>
                <th className="text-right">Leads</th>
              </tr>
            </thead>
            <tbody>
              {ADMIN_CAMPAIGNS.map((c, i) => (
                <tr key={i}>
                  <td>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono">
                      {c.tenant}
                    </span>
                  </td>
                  <td className="font-medium text-gray-800">{c.name}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td className="text-right font-medium">{c.leads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Error log */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="card-title">Global Error Log</h3>
            {openErrors > 0 && (
              <div className="flex items-center gap-1 text-[11px] text-red-500 font-medium">
                <AlertTriangle size={12} />
                {openErrors} open
              </div>
            )}
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Workflow</th>
                <th>Error</th>
                <th>Tenant</th>
              </tr>
            </thead>
            <tbody>
              {ERROR_LOG.map((err, i) => (
                <tr key={i}>
                  <td className="text-xs text-gray-400 whitespace-nowrap">{err.time}</td>
                  <td className="text-xs font-medium">{err.workflow}</td>
                  <td><span className="error-code">{err.code}</span></td>
                  <td>
                    <span className="text-xs font-mono text-gray-500">{err.tenant}</span>
                    {err.open && (
                      <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-red-400 align-middle"></span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tenant table */}
        <div className="card col-span-2">
          <h3 className="card-title mb-3">Tenant Overview</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Tenant ID</th>
                <th>Company</th>
                <th>Plan</th>
                <th>Daily Limit</th>
                <th>Total Leads</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'client_001', company: 'TechCorp',  plan: 'Pro',   limit: 100, leads: 259, status: 'active' },
                { id: 'client_002', company: 'NexaSoft',  plan: 'Pro',   limit: 150, leads: 200, status: 'active' },
                { id: 'client_003', company: 'CloudBase', plan: 'Trial', limit: 50,  leads: 45,  status: 'paused' },
              ].map(t => (
                <tr key={t.id}>
                  <td className="font-mono text-xs text-gray-500">{t.id}</td>
                  <td className="font-medium">{t.company}</td>
                  <td>
                    <span className={`badge ${t.plan === 'Pro' ? 'badge-active' : 'badge-dedup'}`}>
                      {t.plan}
                    </span>
                  </td>
                  <td className="text-center">{t.limit}</td>
                  <td className="text-center font-medium">{t.leads}</td>
                  <td><StatusBadge status={t.status} /></td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn btn-sm">View</button>
                      <button className="btn btn-sm btn-danger">Suspend</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
