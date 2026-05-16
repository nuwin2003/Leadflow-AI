// ── Status badge config ──────────────────────
export const STATUS_META = {
  email_sent:    { label: 'Email Sent',    cls: 'badge-sent'    },
  deduplicating: { label: 'Deduplicating', cls: 'badge-dedup'   },
  paused:        { label: 'Paused',        cls: 'badge-paused'  },
  replied:       { label: 'Replied',       cls: 'badge-replied' },
  duplicate:     { label: 'Duplicate',     cls: 'badge-dedup'   },
  ready_to_email:{ label: 'Ready',         cls: 'badge-ready'   },
  active:        { label: 'Active',        cls: 'badge-active'  },
  idle:          { label: 'Idle',          cls: 'badge-dedup'   },
  error:         { label: 'Error',         cls: 'badge-error'   },
}

export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, cls: 'badge-dedup' }
  return <span className={`badge ${meta.cls}`}>{meta.label}</span>
}

// ── Format helpers ────────────────────────────
export function fmtSource(src) {
  return src.replace('mock_', '').replace(/_/g, ' ')
}

export function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function pct(used, max) {
  return max > 0 ? Math.round((used / max) * 100) : 0
}
