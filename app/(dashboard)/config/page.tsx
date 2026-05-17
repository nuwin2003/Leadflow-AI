"use client";

import { useState } from "react";
import { Eye, EyeOff, Save } from "lucide-react";

function SecretField({
  label,
  id,
  defaultValue,
  placeholder,
}: {
  label: string;
  id: string;
  defaultValue: string;
  placeholder: string;
}) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="conf-field mb-3">
      <label className="form-label" htmlFor={id}>
        {label}
        <span className="secret-badge">SECRET</span>
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          className="form-input flex-1 font-mono text-xs"
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="btn btn-sm flex-shrink-0"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide key" : "Show key"}
        >
          {visible ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      </div>
    </div>
  );
}

function TagInput({ label, initial }: { label: string; initial: string[] }) {
  const [tags, setTags] = useState(initial);
  const [draft, setDraft] = useState("");

  function add() {
    const trimmed = draft.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setDraft("");
  }

  function remove(tag: string) {
    setTags((prev) => prev.filter((item) => item !== tag));
  }

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <div className="tag-wrap">
        {tags.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
            <button onClick={() => remove(tag)} aria-label={`Remove ${tag}`}>
              ×
            </button>
          </span>
        ))}
        <input
          className="bg-transparent outline-none text-xs text-gray-700 min-w-[80px] flex-1"
          placeholder="Add and press Enter..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
      </div>
    </div>
  );
}

export default function ConfigPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [limit, setLimit] = useState(50);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 900);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-gray-800">User Configuration</h2>
        <p className="text-xs text-gray-400">
          Config is stored in Airtable and read by n8n workflows at runtime.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-2 gap-4">
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="card-title">API Credentials</h3>
              <span className="text-[10px] text-gray-300">Stored encrypted</span>
            </div>
            <SecretField
              label="LinkedIn API Token"
              id="li-token"
              defaultValue="lk_sk_**************"
              placeholder="Bearer token from LinkedIn Developer Portal"
            />
            <SecretField
              label="Hunter.io API Key"
              id="hunter-key"
              defaultValue="hio_sk_************"
              placeholder="Get from hunter.io/api"
            />
            <SecretField
              label="Facebook Page Token"
              id="fb-token"
              defaultValue="EAA***************"
              placeholder="Meta for Developers -> Page token"
            />
            <SecretField
              label="Clearbit API Key"
              id="clearbit-key"
              defaultValue="cb_live_************"
              placeholder="Get from clearbit.com/docs"
            />
            <SecretField
              label="Airtable API Key"
              id="airtable-key"
              defaultValue="pat_****************"
              placeholder="Get from airtable.com/account"
            />
          </div>

          <div className="card">
            <h3 className="card-title mb-3">Targeting &amp; Send Settings</h3>
            <TagInput
              label="Target Job Titles"
              initial={["VP Engineering", "CTO", "Head of Product", "Director of Eng"]}
            />
            <TagInput label="Target Industries" initial={["SaaS", "FinTech", "HealthTech"]} />
            <TagInput label="Geography (ISO codes)" initial={["US", "GB", "CA", "AU"]} />

            <div className="mb-3">
              <label className="form-label" htmlFor="daily-limit">
                Daily Send Limit
                <span className="text-gray-300 ml-1 font-normal">(max 500)</span>
              </label>
              <input
                id="daily-limit"
                className="form-input"
                type="number"
                min={1}
                max={500}
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="template-id">
                Email Template ID
              </label>
              <input
                id="template-id"
                className="form-input"
                defaultValue="tmpl_abc123"
                placeholder="Airtable template record ID"
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="conf-threshold">
                Min. Email Confidence Threshold
              </label>
              <div className="flex items-center gap-3">
                <input id="conf-threshold" type="range" min={50} max={100} defaultValue={80} className="flex-1" />
                <span className="text-sm font-medium text-gray-700 w-10 text-right">80%</span>
              </div>
            </div>
          </div>

          <div className="card col-span-2">
            <h3 className="card-title mb-3">n8n Workflow Settings</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="form-label">Schedule (Cron)</label>
                <input className="form-input" defaultValue="0 9 * * 1-5" placeholder="Cron expression" />
                <p className="text-[10px] text-gray-300 mt-1">Weekdays at 9:00 AM</p>
              </div>
              <div>
                <label className="form-label">LinkedIn Results per Run</label>
                <input className="form-input" type="number" defaultValue={25} min={1} max={100} />
              </div>
              <div>
                <label className="form-label">Dedup Strategy</label>
                <select className="form-select">
                  <option>SHA-256 (email + company)</option>
                  <option>Email only</option>
                  <option>Phone + email</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className={`btn btn-primary gap-1.5 ${saving ? "opacity-70 cursor-wait" : ""}`}
            disabled={saving}
          >
            <Save size={13} />
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save Config"}
          </button>
          <button type="reset" className="btn">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
