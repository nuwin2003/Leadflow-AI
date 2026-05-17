import type { LeadStatus } from "@/types/app";

export const STATUS_META: Record<
  LeadStatus,
  { label: string; cls: string }
> = {
  email_sent: { label: "Email Sent", cls: "badge-sent" },
  deduplicating: { label: "Deduplicating", cls: "badge-dedup" },
  paused: { label: "Paused", cls: "badge-paused" },
  replied: { label: "Replied", cls: "badge-replied" },
  duplicate: { label: "Duplicate", cls: "badge-dedup" },
  ready_to_email: { label: "Ready", cls: "badge-ready" },
  active: { label: "Active", cls: "badge-active" },
  idle: { label: "Idle", cls: "badge-dedup" },
  error: { label: "Error", cls: "badge-error" },
};

export function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status as LeadStatus] || {
    label: status,
    cls: "badge-dedup",
  };
  return <span className={`badge ${meta.cls}`}>{meta.label}</span>;
}

export function fmtSource(src: string): string {
  return src.replace("mock_", "").replace(/_/g, " ");
}

export function fmtDate(iso?: string): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function pct(used: number, max: number): number {
  return max > 0 ? Math.round((used / max) * 100) : 0;
}
