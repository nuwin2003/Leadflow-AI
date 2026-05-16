import React from 'react'
import { Plus, MoreHorizontal } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { CAMPAIGNS, TENANT_CONFIGS } from '../data/mockData'
import CampaignTable from '../components/CampaignTable'
import IntegrationsList from '../components/IntegrationsList'
import GaugeChart from '../components/GaugeChart'

function MetricCard({ label, value, sub, subColor = 'text-gray-400' }) {
  return (
    <div className="metric-card">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      <p className={`metric-sub ${subColor}`}>{sub}</p>
    </div>
  )
}

export default function DashboardPage() {
  const { currentTenant, setCurrentTenant, navigate } = useApp()
  const tenantCfg = TENANT_CONFIGS[currentTenant] || TENANT_CONFIGS.all

  return (
    <div className="space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-4 gap-3">
        <MetricCard label="Total Leads"      value="312"  sub="all campaigns"         />
        <MetricCard label="Weekly Additions" value="+50"  sub="↑ added this week" subColor="text-emerald-500" />
        <MetricCard label="Campaign Sources" value="4"    sub="LinkedIn · FB · CSV · API" />
        <MetricCard label="n8n Workflows"    value="8"    sub="7 active · 1 paused"   />
      </div>

      {/* Main 3-column grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr 272px' }}>

        {/* Active Campaigns */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="card-title">Active Campaigns</h2>
            <button className="btn btn-primary btn-sm gap-1" onClick={() => navigate('campaigns')}>
              <Plus size={12} /> New
            </button>
          </div>
          <CampaignTable campaigns={CAMPAIGNS} compact />
        </div>

        {/* Multi-Tenant Config + Gauge */}
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
                onChange={e => setCurrentTenant(e.target.value)}
              >
                {Object.entries(TENANT_CONFIGS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
            </div>
          </div>

          <div className="border-t border-gray-50 pt-4">
            <p className="card-title mb-3">Daily Send Limit</p>
            <GaugeChart used={tenantCfg.used} max={tenantCfg.max} />
          </div>
        </div>

        {/* Integrations panel */}
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
    </div>
  )
}
