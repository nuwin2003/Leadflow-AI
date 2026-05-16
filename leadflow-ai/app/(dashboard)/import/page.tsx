"use client";

import { useMemo, useState } from "react";
import { FileUp, FileWarning, Upload, CheckCircle2 } from "lucide-react";

import { useApp } from "@/context/AppContext";
import type { Lead } from "@/types/app";

const REQUIRED_HEADERS = ["firstName", "lastName", "email", "title", "company"];

function parseCsvRows(input: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const nextChar = input[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current.trim());
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i += 1;
      }
      row.push(current.trim());
      current = "";
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current.trim());
    if (row.some((cell) => cell.length > 0)) {
      rows.push(row);
    }
  }

  return rows;
}

function buildLeadFromRecord(record: Record<string, string>, index: number): Lead {
  const firstName = record.firstName?.trim() ?? "";
  const lastName = record.lastName?.trim() ?? "";
  const email = record.email?.trim().toLowerCase() ?? "";
  const title = record.title?.trim() ?? "Unknown Title";
  const company = record.company?.trim() ?? "Unknown Company";
  const domain = email.includes("@") ? email.split("@")[1] : "unknown.local";

  return {
    id: `lead_csv_${Date.now()}_${index}`,
    firstName,
    lastName,
    email,
    title,
    company,
    industry: record.industry?.trim() || "Unknown",
    companyDomain: domain,
    source: "csv_upload",
    status: "ready_to_email",
    confidence: 80,
    enriched: false,
    dedupHash: `csv_${email}_${company}`.toLowerCase(),
    isMockData: false,
    createdAt: new Date().toISOString(),
  };
}

export default function ImportPage() {
  const { completeCsvImport, hasCompletedCsvImport, pendingImportLeads, setPendingImportLeads } = useApp();
  const [uploading, setUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewRows, setPreviewRows] = useState<Lead[]>(pendingImportLeads);

  const helperText = useMemo(
    () => `Required CSV headers: ${REQUIRED_HEADERS.join(", ")}`,
    [],
  );

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");

    const fileNameLower = file.name.toLowerCase();
    const hasCsvExtension = fileNameLower.endsWith(".csv");
    const mimeAllowed =
      file.type === "" || file.type === "text/csv" || file.type === "application/vnd.ms-excel";

    if (!hasCsvExtension || !mimeAllowed) {
      setError("Only CSV files are allowed. Please upload a .csv file.");
      return;
    }

    try {
      setUploading(true);
      setSelectedFileName(file.name);
      const text = await file.text();
      const rows = parseCsvRows(text);
      if (rows.length < 2) {
        setError("CSV must include headers and at least one lead row.");
        return;
      }

      const [headerRow, ...dataRows] = rows;
      const headers = headerRow.map((header) => header.trim());
      const missingHeaders = REQUIRED_HEADERS.filter((required) => !headers.includes(required));

      if (missingHeaders.length > 0) {
        setError(`Missing required headers: ${missingHeaders.join(", ")}`);
        return;
      }

      const emailIndex = headers.indexOf("email");
      const records = dataRows.map((row) => {
        const entry: Record<string, string> = {};
        headers.forEach((header, idx) => {
          entry[header] = row[idx] ?? "";
        });
        return entry;
      });

      const validRecords = records.filter((record) => {
        const email = record.email?.trim();
        return Boolean(email) && email.includes("@");
      });

      if (validRecords.length === 0 || emailIndex === -1) {
        setError("CSV rows must contain valid company email addresses.");
        return;
      }

      const leads = validRecords.map((record, index) => buildLeadFromRecord(record, index));
      setPendingImportLeads(leads);
      setPreviewRows(leads);
      setSuccess(`Parsed ${leads.length} leads. Click submit to upload to n8n (later).`);
    } catch {
      setError("Unable to parse CSV file. Please verify format and try again.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function handleSubmitToN8n() {
    if (previewRows.length === 0) {
      setError("Please upload a valid CSV file before submitting.");
      return;
    }
    completeCsvImport(previewRows);
    setSuccess(
      "CSV submitted successfully. n8n fetch integration will be connected later. Data is shown below.",
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="card p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <FileUp size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Import your lead CSV</h2>
            <p className="text-sm text-gray-500">
              First-time onboarding requires a valid CSV upload before entering the dashboard.
            </p>
          </div>
        </div>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center transition hover:border-brand-400 hover:bg-brand-50/30">
          <Upload size={22} className="mb-3 text-gray-500" />
          <p className="text-sm font-medium text-gray-700">
            {uploading ? "Uploading..." : "Click to choose CSV file"}
          </p>
          <p className="mt-1 text-xs text-gray-400">{helperText}</p>
          {selectedFileName ? (
            <p className="mt-2 text-xs text-gray-500">Selected: {selectedFileName}</p>
          ) : null}
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            disabled={uploading}
            onChange={handleFileUpload}
          />
        </label>

        {error ? (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            <FileWarning size={14} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {success ? (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        ) : null}

        <div className="mt-4">
          <button
            type="button"
            className="btn btn-primary py-2.5"
            onClick={handleSubmitToN8n}
            disabled={uploading}
          >
            Submit CSV to n8n
          </button>
        </div>

        <p className="mt-5 text-xs text-gray-400">
          {hasCompletedCsvImport
            ? "CSV already imported. Uploading again will replace existing imported leads."
            : "You can navigate other pages without upload, but they stay empty until submission."}
        </p>
      </div>

      <div className="card overflow-x-auto p-0">
        <div className="border-b border-gray-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-800">Imported Data Preview</h3>
          <p className="text-xs text-gray-400">
            {previewRows.length > 0
              ? `${previewRows.length} rows parsed from CSV`
              : "No CSV submitted yet. Table will populate after upload."}
          </p>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th className="pl-4">First Name</th>
              <th>Last Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {previewRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-300">
                  No data yet.
                </td>
              </tr>
            ) : (
              previewRows.map((lead) => (
                <tr key={lead.id}>
                  <td className="pl-4">{lead.firstName}</td>
                  <td>{lead.lastName}</td>
                  <td>{lead.company}</td>
                  <td className="font-mono text-xs text-gray-500">{lead.email}</td>
                  <td>{lead.title}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
