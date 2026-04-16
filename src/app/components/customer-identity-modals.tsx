"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  X,
  Download,
  Upload,
  Settings,
  FileText,
  FileJson,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Users,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import type { UnifiedCustomer } from "./customer-identity-manager";

/* -------------------------------------------------------------------------- */
/*  Delad overlay-wrapper                                                     */
/* -------------------------------------------------------------------------- */

function ModalShell({
  title,
  icon,
  onClose,
  children,
  maxWidth = "max-w-2xl",
}: {
  title: string;
  icon: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800`}
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow">
              {icon}
            </div>
            <h2 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Stäng"
            className="h-6 w-6 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Export Modal                                                              */
/* -------------------------------------------------------------------------- */

type ExportField =
  | "id"
  | "primaryName"
  | "primaryEmail"
  | "allEmails"
  | "primaryPhone"
  | "allPhones"
  | "totalConversations"
  | "totalMessages"
  | "lifetimeValue"
  | "isVIP"
  | "tags"
  | "notes"
  | "firstContact"
  | "lastContact";

const EXPORT_FIELDS: { key: ExportField; label: string; defaultOn: boolean }[] =
  [
    { key: "id", label: "ID", defaultOn: false },
    { key: "primaryName", label: "Namn", defaultOn: true },
    { key: "primaryEmail", label: "Primär email", defaultOn: true },
    { key: "allEmails", label: "Alla email-adresser", defaultOn: false },
    { key: "primaryPhone", label: "Primär telefon", defaultOn: true },
    { key: "allPhones", label: "Alla telefoner", defaultOn: false },
    { key: "totalConversations", label: "Konversationer", defaultOn: true },
    { key: "totalMessages", label: "Meddelanden", defaultOn: false },
    { key: "lifetimeValue", label: "LTV", defaultOn: true },
    { key: "isVIP", label: "VIP", defaultOn: true },
    { key: "tags", label: "Taggar", defaultOn: false },
    { key: "notes", label: "Anteckningar", defaultOn: false },
    { key: "firstContact", label: "Första kontakt", defaultOn: false },
    { key: "lastContact", label: "Senaste kontakt", defaultOn: false },
  ];

type ExportFilter = "all" | "vip" | "withLTV" | "merged";

function getFieldValue(customer: UnifiedCustomer, field: ExportField): string {
  switch (field) {
    case "id":
      return customer.id;
    case "primaryName":
      return customer.primaryName;
    case "primaryEmail":
      return customer.emails.find((e) => e.isPrimary)?.email ?? "";
    case "allEmails":
      return customer.emails.map((e) => e.email).join("; ");
    case "primaryPhone":
      return customer.phones.find((p) => p.isPrimary)?.phone ?? "";
    case "allPhones":
      return customer.phones.map((p) => p.phone).join("; ");
    case "totalConversations":
      return String(customer.totalConversations);
    case "totalMessages":
      return String(customer.totalMessages);
    case "lifetimeValue":
      return String(customer.lifetimeValue ?? 0);
    case "isVIP":
      return customer.isVIP ? "Ja" : "Nej";
    case "tags":
      return customer.tags.join("; ");
    case "notes":
      return customer.notes ?? "";
    case "firstContact":
      return customer.firstContact;
    case "lastContact":
      return customer.lastContact;
  }
}

function csvEscape(value: string): string {
  if (value.includes('"') || value.includes(",") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function triggerDownload(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ExportCustomersModal({
  customers,
  onClose,
}: {
  customers: UnifiedCustomer[];
  onClose: () => void;
}) {
  const [format, setFormat] = useState<"csv" | "json" | "xlsx">("csv");
  const [filter, setFilter] = useState<ExportFilter>("all");
  const [selectedFields, setSelectedFields] = useState<Set<ExportField>>(
    () => new Set(EXPORT_FIELDS.filter((f) => f.defaultOn).map((f) => f.key)),
  );
  const [isExporting, setIsExporting] = useState(false);

  const filtered = useMemo(() => {
    switch (filter) {
      case "vip":
        return customers.filter((c) => c.isVIP);
      case "withLTV":
        return customers.filter((c) => (c.lifetimeValue ?? 0) > 0);
      case "merged":
        return customers.filter((c) => c.mergedProfiles.length > 0);
      default:
        return customers;
    }
  }, [customers, filter]);

  const toggleField = (field: ExportField) => {
    setSelectedFields((prev) => {
      const next = new Set(prev);
      if (next.has(field)) next.delete(field);
      else next.add(field);
      return next;
    });
  };

  const handleExport = async () => {
    if (selectedFields.size === 0) {
      toast.error("Välj minst ett fält att exportera");
      return;
    }
    if (filtered.length === 0) {
      toast.error("Inga kunder matchar det valda filtret");
      return;
    }

    setIsExporting(true);
    // Kort fördröjning för att ge feedback
    await new Promise((r) => setTimeout(r, 300));

    const activeFields = EXPORT_FIELDS.filter((f) => selectedFields.has(f.key));
    const timestamp = new Date().toISOString().split("T")[0];

    if (format === "csv" || format === "xlsx") {
      const header = activeFields.map((f) => csvEscape(f.label)).join(",");
      const rows = filtered.map((c) =>
        activeFields.map((f) => csvEscape(getFieldValue(c, f.key))).join(","),
      );
      const content = [header, ...rows].join("\n");
      // BOM för att Excel ska läsa UTF-8 korrekt
      triggerDownload(
        `kunder-${timestamp}.${format}`,
        "\uFEFF" + content,
        format === "xlsx"
          ? "application/vnd.ms-excel"
          : "text/csv;charset=utf-8",
      );
    } else {
      const rows = filtered.map((c) => {
        const obj: Record<string, string> = {};
        activeFields.forEach((f) => {
          obj[f.key] = getFieldValue(c, f.key);
        });
        return obj;
      });
      triggerDownload(
        `kunder-${timestamp}.json`,
        JSON.stringify(rows, null, 2),
        "application/json",
      );
    }

    setIsExporting(false);
    toast.success(
      `Exporterade ${filtered.length} kund${filtered.length === 1 ? "" : "er"} till ${format.toUpperCase()}`,
    );
    onClose();
  };

  return (
    <ModalShell
      title="Exportera kunder"
      icon={<Download className="h-3 w-3 text-white" />}
      onClose={onClose}
    >
      <div className="p-4 space-y-4">
        {/* Format */}
        <div>
          <label className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
            Filformat
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { key: "csv", label: "CSV", icon: FileText },
                { key: "xlsx", label: "Excel", icon: FileSpreadsheet },
                { key: "json", label: "JSON", icon: FileJson },
              ] as const
            ).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFormat(key)}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-md border text-[10px] font-medium transition ${
                  format === key
                    ? "border-pink-500 bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-200"
                    : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300"
                }`}
              >
                <Icon className="h-3 w-3" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div>
          <label className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
            Vilka kunder?
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as ExportFilter)}
            className="w-full px-2 py-1.5 text-[10px] border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">Alla kunder ({customers.length})</option>
            <option value="vip">
              Endast VIP ({customers.filter((c) => c.isVIP).length})
            </option>
            <option value="withLTV">
              Med LTV &gt; 0 (
              {customers.filter((c) => (c.lifetimeValue ?? 0) > 0).length})
            </option>
            <option value="merged">
              Sammanslagna profiler (
              {customers.filter((c) => c.mergedProfiles.length > 0).length})
            </option>
          </select>
        </div>

        {/* Fält */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-semibold text-gray-700 dark:text-gray-300">
              Fält att exportera ({selectedFields.size} valda)
            </label>
            <div className="flex gap-1">
              <button
                onClick={() =>
                  setSelectedFields(
                    new Set(EXPORT_FIELDS.map((f) => f.key)),
                  )
                }
                className="text-[9px] text-pink-600 hover:underline"
              >
                Alla
              </button>
              <span className="text-[9px] text-gray-400">/</span>
              <button
                onClick={() => setSelectedFields(new Set())}
                className="text-[9px] text-gray-600 hover:underline"
              >
                Inga
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1 border border-gray-200 dark:border-gray-700 rounded-md p-2 max-h-48 overflow-y-auto">
            {EXPORT_FIELDS.map((f) => (
              <label
                key={f.key}
                className="flex items-center gap-1.5 text-[10px] text-gray-700 dark:text-gray-300 cursor-pointer py-0.5 px-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <input
                  type="checkbox"
                  checked={selectedFields.has(f.key)}
                  onChange={() => toggleField(f.key)}
                  className="h-3 w-3 accent-pink-600"
                />
                {f.label}
              </label>
            ))}
          </div>
        </div>

        {/* Sammanfattning */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-2 text-[10px] text-blue-900 dark:text-blue-100">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-blue-600" />
            <span>
              Kommer exportera <b>{filtered.length}</b> kunder med{" "}
              <b>{selectedFields.size}</b> fält i <b>{format.toUpperCase()}</b>
              -format.
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 px-4 py-2.5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
        <Button
          variant="outline"
          onClick={onClose}
          className="text-[10px] h-7 px-3"
        >
          Avbryt
        </Button>
        <Button
          onClick={handleExport}
          disabled={isExporting || selectedFields.size === 0}
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-[10px] h-7 px-3 text-white"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Exporterar...
            </>
          ) : (
            <>
              <Download className="h-3 w-3 mr-1" />
              Exportera {filtered.length}
            </>
          )}
        </Button>
      </div>
    </ModalShell>
  );
}

/* -------------------------------------------------------------------------- */
/*  Import Modal                                                              */
/* -------------------------------------------------------------------------- */

type ImportStep = "upload" | "mapping" | "review" | "done";

type ImportField =
  | "primaryName"
  | "primaryEmail"
  | "primaryPhone"
  | "lifetimeValue"
  | "isVIP"
  | "tags"
  | "notes"
  | "ignore";

const IMPORT_FIELDS: { key: ImportField; label: string }[] = [
  { key: "ignore", label: "— Ignorera —" },
  { key: "primaryName", label: "Namn" },
  { key: "primaryEmail", label: "Email" },
  { key: "primaryPhone", label: "Telefon" },
  { key: "lifetimeValue", label: "LTV" },
  { key: "isVIP", label: "VIP" },
  { key: "tags", label: "Taggar" },
  { key: "notes", label: "Anteckningar" },
];

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        current.push(field);
        field = "";
      } else if (ch === "\n" || ch === "\r") {
        if (field !== "" || current.length > 0) {
          current.push(field);
          rows.push(current);
          current = [];
          field = "";
        }
        if (ch === "\r" && text[i + 1] === "\n") i++;
      } else {
        field += ch;
      }
    }
  }
  if (field !== "" || current.length > 0) {
    current.push(field);
    rows.push(current);
  }
  // Ta bort BOM från första cell
  if (rows.length > 0 && rows[0][0]?.charCodeAt(0) === 0xfeff) {
    rows[0][0] = rows[0][0].slice(1);
  }
  return rows;
}

function autoMapHeader(header: string): ImportField {
  const h = header.trim().toLowerCase();
  if (/(namn|name|full.?name)/.test(h)) return "primaryName";
  if (/(email|e-?post|mail)/.test(h)) return "primaryEmail";
  if (/(telefon|phone|tel|mobil)/.test(h)) return "primaryPhone";
  if (/(ltv|lifetime|värde|value)/.test(h)) return "lifetimeValue";
  if (/vip/.test(h)) return "isVIP";
  if (/(tagg|tag)/.test(h)) return "tags";
  if (/(not|anteck|note)/.test(h)) return "notes";
  return "ignore";
}

export function ImportCustomersModal({
  existingCustomers,
  onClose,
  onImport,
}: {
  existingCustomers: UnifiedCustomer[];
  onClose: () => void;
  onImport: (newCustomers: UnifiedCustomer[]) => void;
}) {
  const [step, setStep] = useState<ImportStep>("upload");
  const [fileName, setFileName] = useState<string>("");
  const [rawRows, setRawRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<ImportField[]>([]);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const headers = rawRows[0] ?? [];
  const dataRows = rawRows.slice(1);

  const existingEmails = useMemo(
    () =>
      new Set(
        existingCustomers.flatMap((c) =>
          c.emails.map((e) => e.email.toLowerCase()),
        ),
      ),
    [existingCustomers],
  );

  const { validRows, duplicateCount, invalidCount } = useMemo(() => {
    const emailColIdx = mapping.findIndex((m) => m === "primaryEmail");
    const nameColIdx = mapping.findIndex((m) => m === "primaryName");
    let duplicates = 0;
    let invalid = 0;
    const valid: { row: string[]; email: string; name: string }[] = [];
    dataRows.forEach((row) => {
      const email = emailColIdx >= 0 ? (row[emailColIdx] ?? "").trim() : "";
      const name = nameColIdx >= 0 ? (row[nameColIdx] ?? "").trim() : "";
      if (!name && !email) {
        invalid++;
        return;
      }
      if (email && existingEmails.has(email.toLowerCase())) {
        duplicates++;
        if (skipDuplicates) return;
      }
      valid.push({ row, email, name });
    });
    return {
      validRows: valid,
      duplicateCount: duplicates,
      invalidCount: invalid,
    };
  }, [dataRows, mapping, existingEmails, skipDuplicates]);

  const handleFile = async (file: File) => {
    const text = await file.text();
    const rows = parseCSV(text).filter((r) => r.some((c) => c.trim() !== ""));
    if (rows.length < 2) {
      toast.error("Filen verkar tom eller saknar data-rader");
      return;
    }
    setFileName(file.name);
    setRawRows(rows);
    setMapping(rows[0].map((h) => autoMapHeader(h)));
    setStep("mapping");
  };

  const handleConfirmImport = () => {
    const now = new Date().toISOString();
    const newCustomers: UnifiedCustomer[] = validRows.map(
      ({ row, email, name }, idx) => {
        const pick = (field: ImportField) => {
          const i = mapping.findIndex((m) => m === field);
          return i >= 0 ? (row[i] ?? "").trim() : "";
        };
        const phone = pick("primaryPhone");
        const ltvRaw = pick("lifetimeValue");
        const ltv = parseFloat(ltvRaw.replace(/[^\d.,-]/g, "").replace(",", "."));
        const isVIPRaw = pick("isVIP").toLowerCase();
        const tagsRaw = pick("tags");
        return {
          id: `imported-${Date.now()}-${idx}`,
          primaryName: name || email.split("@")[0] || "Ny kund",
          emails: email
            ? [
                {
                  email,
                  isPrimary: true,
                  verified: false,
                  firstSeen: now,
                  lastUsed: now,
                  messageCount: 0,
                },
              ]
            : [],
          phones: phone
            ? [
                {
                  phone,
                  isPrimary: true,
                  verified: false,
                  firstSeen: now,
                  lastUsed: now,
                },
              ]
            : [],
          totalConversations: 0,
          totalMessages: 0,
          firstContact: now,
          lastContact: now,
          lifetimeValue: isNaN(ltv) ? 0 : ltv,
          isVIP: ["ja", "yes", "true", "1", "vip"].includes(isVIPRaw),
          mergedProfiles: [],
          tags: tagsRaw
            ? tagsRaw.split(/[;,|]/).map((t) => t.trim()).filter(Boolean)
            : [],
          notes: pick("notes"),
        } as UnifiedCustomer;
      },
    );

    onImport(newCustomers);
    setStep("done");
    toast.success(
      `Importerade ${newCustomers.length} kund${newCustomers.length === 1 ? "" : "er"}`,
    );
  };

  return (
    <ModalShell
      title="Importera kunder"
      icon={<Upload className="h-3 w-3 text-white" />}
      onClose={onClose}
      maxWidth="max-w-3xl"
    >
      {/* Stegindikator */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
        <div className="flex items-center gap-1.5 text-[9px]">
          {(
            [
              { key: "upload", label: "1. Ladda upp" },
              { key: "mapping", label: "2. Matcha fält" },
              { key: "review", label: "3. Granska" },
              { key: "done", label: "4. Klart" },
            ] as const
          ).map((s, idx, arr) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded-full font-medium ${
                  step === s.key
                    ? "bg-pink-500 text-white"
                    : arr.findIndex((x) => x.key === step) > idx
                      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {s.label}
              </span>
              {idx < arr.length - 1 && (
                <ArrowRight className="h-2.5 w-2.5 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        {step === "upload" && (
          <div className="space-y-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) handleFile(file);
              }}
              className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-pink-500 cursor-pointer transition"
            >
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-200">
                Klicka eller dra en CSV-fil hit
              </p>
              <p className="text-[9px] text-gray-500 mt-1">
                Första raden ska innehålla kolumnrubriker. Stöd för UTF-8 / BOM.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-2 text-[9px] text-amber-900 dark:text-amber-100 flex gap-1.5">
              <AlertTriangle className="h-3 w-3 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                Minst <b>Namn</b> eller <b>Email</b> måste finnas per rad.
                Dubbletter matchas mot befintliga email-adresser.
              </span>
            </div>
          </div>
        )}

        {step === "mapping" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] text-gray-700 dark:text-gray-300">
                <span className="font-semibold">{fileName}</span> —{" "}
                {dataRows.length} rader, {headers.length} kolumner
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
              <table className="w-full text-[10px]">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Kolumn i filen
                    </th>
                    <th className="px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Exempel
                    </th>
                    <th className="px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Matcha mot
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {headers.map((header, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-gray-200 dark:border-gray-800"
                    >
                      <td className="px-2 py-1.5 font-medium text-gray-900 dark:text-gray-100">
                        {header || <em className="text-gray-400">(tom)</em>}
                      </td>
                      <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400 max-w-[180px] truncate">
                        {dataRows[0]?.[idx] || (
                          <em className="text-gray-400">—</em>
                        )}
                      </td>
                      <td className="px-2 py-1.5">
                        <select
                          value={mapping[idx] ?? "ignore"}
                          onChange={(e) => {
                            const next = [...mapping];
                            next[idx] = e.target.value as ImportField;
                            setMapping(next);
                          }}
                          className="w-full px-1.5 py-0.5 text-[10px] border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-pink-500"
                        >
                          {IMPORT_FIELDS.map((f) => (
                            <option key={f.key} value={f.key}>
                              {f.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <label className="flex items-center gap-1.5 text-[10px] text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={skipDuplicates}
                onChange={(e) => setSkipDuplicates(e.target.checked)}
                className="h-3 w-3 accent-pink-600"
              />
              Hoppa över rader med email som redan finns
            </label>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md p-2 text-center">
                <div className="text-[18px] font-bold text-green-700 dark:text-green-300">
                  {validRows.length}
                </div>
                <div className="text-[9px] text-green-700 dark:text-green-300">
                  Kommer importeras
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-2 text-center">
                <div className="text-[18px] font-bold text-amber-700 dark:text-amber-300">
                  {duplicateCount}
                </div>
                <div className="text-[9px] text-amber-700 dark:text-amber-300">
                  Dubbletter {skipDuplicates ? "(hoppas över)" : "(importeras)"}
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md p-2 text-center">
                <div className="text-[18px] font-bold text-red-700 dark:text-red-300">
                  {invalidCount}
                </div>
                <div className="text-[9px] text-red-700 dark:text-red-300">
                  Ogiltiga rader
                </div>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
              <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-[9px] font-semibold text-gray-700 dark:text-gray-300">
                Förhandsgranskning (första 5 raderna)
              </div>
              <table className="w-full text-[10px]">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-2 py-1 text-left font-semibold text-gray-600 dark:text-gray-400">
                      Namn
                    </th>
                    <th className="px-2 py-1 text-left font-semibold text-gray-600 dark:text-gray-400">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {validRows.slice(0, 5).map((r, i) => (
                    <tr
                      key={i}
                      className="border-t border-gray-200 dark:border-gray-800"
                    >
                      <td className="px-2 py-1 text-gray-900 dark:text-gray-100">
                        {r.name || <em className="text-gray-400">—</em>}
                      </td>
                      <td className="px-2 py-1 text-gray-700 dark:text-gray-300">
                        {r.email || <em className="text-gray-400">—</em>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">
              Import slutförd
            </p>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">
              {validRows.length} nya kunder har lagts till.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
        <div>
          {(step === "mapping" || step === "review") && (
            <Button
              variant="outline"
              onClick={() =>
                setStep(step === "review" ? "mapping" : "upload")
              }
              className="text-[10px] h-7 px-3"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Tillbaka
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-[10px] h-7 px-3"
          >
            {step === "done" ? "Stäng" : "Avbryt"}
          </Button>
          {step === "mapping" && (
            <Button
              onClick={() => setStep("review")}
              disabled={
                !mapping.some(
                  (m) => m === "primaryName" || m === "primaryEmail",
                )
              }
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-[10px] h-7 px-3 text-white"
            >
              Nästa
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          )}
          {step === "review" && (
            <Button
              onClick={handleConfirmImport}
              disabled={validRows.length === 0}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-[10px] h-7 px-3 text-white"
            >
              <Upload className="h-3 w-3 mr-1" />
              Importera {validRows.length}
            </Button>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

/* -------------------------------------------------------------------------- */
/*  Settings Modal                                                            */
/* -------------------------------------------------------------------------- */

export interface CustomerIdentitySettings {
  autoMergeEnabled: boolean;
  autoMergeThreshold: number; // 0-100
  requireEmailVerification: boolean;
  notifyOnDuplicates: boolean;
  preferredEmailProvider: "first" | "latest" | "verified";
  defaultVIPThreshold: number; // LTV i kr
  retainMergedProfilesDays: number;
}

export const DEFAULT_SETTINGS: CustomerIdentitySettings = {
  autoMergeEnabled: false,
  autoMergeThreshold: 95,
  requireEmailVerification: true,
  notifyOnDuplicates: true,
  preferredEmailProvider: "verified",
  defaultVIPThreshold: 50000,
  retainMergedProfilesDays: 90,
};

export function CustomerIdentitySettingsModal({
  initialSettings,
  onClose,
  onSave,
  onResetData,
}: {
  initialSettings: CustomerIdentitySettings;
  onClose: () => void;
  onSave: (settings: CustomerIdentitySettings) => void;
  onResetData?: () => void;
}) {
  const [settings, setSettings] = useState(initialSettings);

  const update = <K extends keyof CustomerIdentitySettings>(
    key: K,
    value: CustomerIdentitySettings[K],
  ) => setSettings((prev) => ({ ...prev, [key]: value }));

  return (
    <ModalShell
      title="Inställningar för kundidentitet"
      icon={<Settings className="h-3 w-3 text-white" />}
      onClose={onClose}
    >
      <div className="p-4 space-y-4">
        {/* Auto-merge */}
        <section className="space-y-2">
          <h3 className="text-[11px] font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
            <Users className="h-3 w-3 text-pink-600" />
            Automatisk sammanslagning
          </h3>

          <label className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
            <div className="flex-1">
              <div className="text-[10px] font-medium text-gray-900 dark:text-gray-100">
                Aktivera auto-merge
              </div>
              <div className="text-[9px] text-gray-600 dark:text-gray-400">
                Slå automatiskt ihop profiler som överstiger tröskelvärdet
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoMergeEnabled}
              onChange={(e) => update("autoMergeEnabled", e.target.checked)}
              className="h-3.5 w-3.5 accent-pink-600"
            />
          </label>

          <div className="py-1.5 px-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-medium text-gray-900 dark:text-gray-100">
                Konfidenströskel
              </label>
              <span className="text-[10px] font-bold text-pink-600">
                {settings.autoMergeThreshold}%
              </span>
            </div>
            <input
              type="range"
              min={70}
              max={100}
              step={1}
              value={settings.autoMergeThreshold}
              onChange={(e) =>
                update("autoMergeThreshold", parseInt(e.target.value, 10))
              }
              disabled={!settings.autoMergeEnabled}
              className="w-full accent-pink-600 disabled:opacity-50"
            />
            <div className="flex justify-between text-[8px] text-gray-500 mt-0.5">
              <span>70% (aggressivt)</span>
              <span>100% (säkert)</span>
            </div>
          </div>
        </section>

        {/* Notifieringar */}
        <section className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-[11px] font-semibold text-gray-900 dark:text-gray-100">
            Notifieringar &amp; verifiering
          </h3>

          <label className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
            <div className="flex-1">
              <div className="text-[10px] font-medium text-gray-900 dark:text-gray-100">
                Notifiera vid nya dubbletter
              </div>
              <div className="text-[9px] text-gray-600 dark:text-gray-400">
                Visa toast när systemet upptäcker potentiella dubbletter
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifyOnDuplicates}
              onChange={(e) =>
                update("notifyOnDuplicates", e.target.checked)
              }
              className="h-3.5 w-3.5 accent-pink-600"
            />
          </label>

          <label className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
            <div className="flex-1">
              <div className="text-[10px] font-medium text-gray-900 dark:text-gray-100">
                Kräv email-verifiering
              </div>
              <div className="text-[9px] text-gray-600 dark:text-gray-400">
                Importerade email-adresser markeras som overifierade
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.requireEmailVerification}
              onChange={(e) =>
                update("requireEmailVerification", e.target.checked)
              }
              className="h-3.5 w-3.5 accent-pink-600"
            />
          </label>

          <div className="py-1.5 px-2">
            <label className="text-[10px] font-medium text-gray-900 dark:text-gray-100 block mb-1">
              Föredragen primär email vid merge
            </label>
            <select
              value={settings.preferredEmailProvider}
              onChange={(e) =>
                update(
                  "preferredEmailProvider",
                  e.target.value as CustomerIdentitySettings["preferredEmailProvider"],
                )
              }
              className="w-full px-2 py-1 text-[10px] border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="verified">Verifierad email (rekommenderas)</option>
              <option value="latest">Senast tillagda</option>
              <option value="first">Först tillagda</option>
            </select>
          </div>
        </section>

        {/* VIP och retention */}
        <section className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-[11px] font-semibold text-gray-900 dark:text-gray-100">
            VIP &amp; retention
          </h3>

          <div className="py-1.5 px-2">
            <label className="text-[10px] font-medium text-gray-900 dark:text-gray-100 block mb-1">
              VIP-tröskel (LTV i kr)
            </label>
            <input
              type="number"
              min={0}
              step={1000}
              value={settings.defaultVIPThreshold}
              onChange={(e) =>
                update(
                  "defaultVIPThreshold",
                  Math.max(0, parseInt(e.target.value || "0", 10)),
                )
              }
              className="w-full px-2 py-1 text-[10px] border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <p className="text-[9px] text-gray-500 mt-0.5">
              Kunder med LTV över detta markeras automatiskt som VIP
            </p>
          </div>

          <div className="py-1.5 px-2">
            <label className="text-[10px] font-medium text-gray-900 dark:text-gray-100 block mb-1">
              Behåll sammanslagna profiler i (dagar)
            </label>
            <input
              type="number"
              min={0}
              max={3650}
              value={settings.retainMergedProfilesDays}
              onChange={(e) =>
                update(
                  "retainMergedProfilesDays",
                  Math.max(0, parseInt(e.target.value || "0", 10)),
                )
              }
              className="w-full px-2 py-1 text-[10px] border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <p className="text-[9px] text-gray-500 mt-0.5">
              0 = behåll permanent
            </p>
          </div>
        </section>

        {/* Danger zone */}
        {onResetData && (
          <section className="pt-2 border-t border-red-200 dark:border-red-900">
            <h3 className="text-[11px] font-semibold text-red-700 dark:text-red-400 flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="h-3 w-3" />
              Farozon
            </h3>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Är du säker på att du vill återställa all kunddata till ursprungsdata? Detta kan inte ångras.",
                  )
                ) {
                  onResetData();
                  toast.success("Kunddata återställd");
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-2 py-1.5 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 rounded-md text-[10px] font-medium hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <Trash2 className="h-3 w-3" />
              Återställ kunddata
            </button>
          </section>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
        <button
          onClick={() => setSettings(DEFAULT_SETTINGS)}
          className="text-[10px] text-gray-600 dark:text-gray-400 hover:underline"
        >
          Återställ till standard
        </button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-[10px] h-7 px-3"
          >
            Avbryt
          </Button>
          <Button
            onClick={() => {
              onSave(settings);
              toast.success("Inställningar sparade");
              onClose();
            }}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-[10px] h-7 px-3 text-white"
          >
            Spara
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}
