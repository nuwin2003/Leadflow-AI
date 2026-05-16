import React from 'react'
import { WEBHOOKS } from '../data/mockData'
import { StatusBadge } from '../utils/helpers'
import IntegrationsList from '../components/IntegrationsList'

export default function IntegrationsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-gray-800">Integration Status</h2>
        <p className="text-xs text-gray-400">Manage connected services and webhooks</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Connected services */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="card-title">Connected Services</h3>
            <span className="text-[10px] text-gray-400">Toggle to update Airtable config</span>
          </div>
          <IntegrationsList showDetails />
        </div>

        {/* Webhooks */}
        <div className="card">
          <h3 className="card-title mb-3">Webhook Endpoints</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Webhook</th>
                <th>Trigger</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {WEBHOOKS.map(wh => (
                <tr key={wh.name}>
                  <td className="font-medium">{wh.name}</td>
                  <td className="text-xs text-gray-400">{wh.trigger}</td>
                  <td><StatusBadge status={wh.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* API rate limits info */}
        <div className="card col-span-2">
          <h3 className="card-title mb-3">Rate Limits & Quotas</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Limit</th>
                <th>Fallback Strategy</th>
              </tr>
            </thead>
            <tbody>
              {[
                { svc: 'LinkedIn API',    limit: '100 req/day',   fallback: 'Queue + spread across days' },
                { svc: 'Facebook Graph',  limit: '200 calls/hr',  fallback: 'Cache responses, batch calls' },
                { svc: 'Hunter.io (free)',limit: '25 req/month',  fallback: 'Rotate keys, use Snov.io backup' },
                { svc: 'Gmail SMTP',      limit: '500 emails/day',fallback: 'Switch to SendGrid (100/day free)' },
                { svc: 'Clearbit (free)', limit: '20 enrich/month',fallback: 'Skip enrichment for free-tier' },
              ].map(r => (
                <tr key={r.svc}>
                  <td className="font-medium">{r.svc}</td>
                  <td className="font-mono text-xs text-gray-500">{r.limit}</td>
                  <td className="text-xs text-gray-400">{r.fallback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
