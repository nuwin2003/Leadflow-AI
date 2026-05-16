import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { TREND_DATA } from "@/data/mockData";

const chartData = TREND_DATA.labels.map((label, i) => ({
  day: label,
  sent: TREND_DATA.values[i],
}));

function StatCard({
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

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm text-sm">
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className="font-semibold text-gray-900">{payload[0]?.value} sent</p>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-gray-800">Performance Analytics</h2>
        <p className="text-xs text-gray-400">Last 30 days across all campaigns</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <StatCard
          label="Emails Sent Today"
          value="48"
          sub="96% of daily limit"
          subColor="text-emerald-500"
        />
        <StatCard
          label="Open Rate"
          value="34%"
          sub="+4% vs last week"
          subColor="text-emerald-500"
        />
        <StatCard label="Reply Rate" value="8.2%" sub="-1.1% vs last week" subColor="text-red-400" />
        <StatCard label="Bounce Rate" value="1.8%" sub="within safe range" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="card-title">Emails Sent - Last 14 Days</h3>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="inline-block w-3 h-0.5 bg-brand-600 rounded" />
            Sent per day
          </div>
        </div>
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#185FA5" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#185FA5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                domain={[0, 60]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="sent"
                stroke="#185FA5"
                strokeWidth={2}
                fill="url(#grad)"
                dot={{ r: 3, fill: "#185FA5", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title mb-3">Lead Status Breakdown</h3>
        <div className="space-y-2.5">
          {[
            { label: "Email Sent", count: 238, pct: 76, color: "#10B981" },
            { label: "Ready to Email", count: 42, pct: 13, color: "#185FA5" },
            { label: "Replied", count: 24, pct: 8, color: "#7C3AED" },
            { label: "Duplicate", count: 8, pct: 3, color: "#D1D5DB" },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-28 flex-shrink-0">{row.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${row.pct}%`, background: row.color }} />
              </div>
              <span className="text-xs font-medium text-gray-600 w-8 text-right">{row.count}</span>
              <span className="text-xs text-gray-300 w-7 text-right">{row.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
