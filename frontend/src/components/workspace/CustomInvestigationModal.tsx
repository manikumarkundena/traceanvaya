"use client";

import React, { useState } from "react";
import { ShieldAlert, Plus, Trash2, Upload, Eye, X, FolderPlus } from "lucide-react";

const SOURCE_PRESETS = [
  "Frontend",
  "Backend",
  "Database",
  "API gateway",
  "Authentication service",
  "Infrastructure",
  "Custom service",
] as const;

export interface PendingLogSource {
  id: string;
  label: string;
  filename: string;
  rawContent: string;
}

interface CustomInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    projectName: string;
    incidentTitle: string;
    incidentDescription: string;
    affectedService: string;
    severity: string;
    sources: PendingLogSource[];
  }) => Promise<void>;
}

function previewSanitize(raw: string): string {
  return raw
    .replace(/(bearer\s+)[a-zA-Z0-9_\-\.]{15,}/gi, "$1[REDACTED_TOKEN]")
    .replace(/(api[_-]?key["']?\s*[:=]\s*["']?)[a-zA-Z0-9_\-]{16,}(["']?)/gi, "$1[REDACTED_API_KEY]$2")
    .replace(/(password["']?\s*[:=]\s*["\']?)[^"'\s]{6,}(["']?)/gi, "$1[REDACTED_PASSWORD]$2")
    .replace(/eyJ[a-zA-Z0-9_\-]{10,}\.eyJ[a-zA-Z0-9_\-]{10,}\.[a-zA-Z0-9_\-]{10,}/g, "[REDACTED_JWT]")
    .replace(/((?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis):\/\/[^:\s/]+:)[^@\s]+(@)/gi, "$1[REDACTED_DB_PASS]$2");
}

export function CustomInvestigationModal({
  isOpen,
  onClose,
  onSubmit,
}: CustomInvestigationModalProps) {
  const [projectName, setProjectName] = useState("");
  const [incidentTitle, setIncidentTitle] = useState("");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [affectedService, setAffectedService] = useState("");
  const [severity, setSeverity] = useState("UNKNOWN");

  const [sourcePreset, setSourcePreset] = useState<string>("Backend");
  const [customSourceName, setCustomSourceName] = useState("");
  const [pastedLogs, setPastedLogs] = useState("");
  const [sources, setSources] = useState<PendingLogSource[]>([]);
  const [showSanitizedPreview, setShowSanitizedPreview] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const resolvedSourceLabel =
    sourcePreset === "Custom service"
      ? customSourceName.trim() || "custom-service"
      : sourcePreset;

  const handleAddPastedSource = () => {
    setErrorMsg(null);
    if (!pastedLogs.trim()) {
      setErrorMsg("Paste log lines before adding a source.");
      return;
    }
    setSources((prev) => [
      ...prev,
      {
        id: `src-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        label: resolvedSourceLabel,
        filename: `${resolvedSourceLabel.toLowerCase().replace(/\s+/g, "-")}.log`,
        rawContent: pastedLogs,
      },
    ]);
    setPastedLogs("");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!["log", "txt", "json", "jsonl"].includes(ext)) {
      setErrorMsg(`Unsupported file format '.${ext}'. Upload .log, .txt, .json, or .jsonl.`);
      e.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File exceeds 10 MB upload limit.");
      e.target.value = "";
      return;
    }
    const text = await file.text();
    if (!text.trim()) {
      setErrorMsg(`File '${file.name}' is empty.`);
      e.target.value = "";
      return;
    }
    setSources((prev) => [
      ...prev,
      {
        id: `src-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        label: resolvedSourceLabel,
        filename: file.name,
        rawContent: text,
      },
    ]);
    e.target.value = "";
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!incidentTitle.trim()) {
      setErrorMsg("Please enter an incident title.");
      return;
    }

    const finalSources = [...sources];
    if (pastedLogs.trim()) {
      finalSources.push({
        id: `src-${Date.now()}`,
        label: resolvedSourceLabel,
        filename: `${resolvedSourceLabel.toLowerCase().replace(/\s+/g, "-")}.log`,
        rawContent: pastedLogs,
      });
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        projectName: projectName.trim(),
        incidentTitle: incidentTitle.trim(),
        incidentDescription: incidentDescription.trim(),
        affectedService: affectedService.trim() || finalSources[0]?.label || "unknown",
        severity,
        sources: finalSources,
      });
      setProjectName("");
      setIncidentTitle("");
      setIncidentDescription("");
      setAffectedService("");
      setSeverity("UNKNOWN");
      setPastedLogs("");
      setSources([]);
      setShowSanitizedPreview(false);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to create custom investigation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="New custom investigation"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl max-h-[90vh] rounded-2xl border border-white/[0.12] bg-[#0B110E] flex flex-col shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0F1713]">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-foreground">Investigate your own incident</h2>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="p-1 rounded-md text-muted hover:text-foreground hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Privacy Notice */}
          <div className="p-3 rounded-lg bg-warning/10 border border-warning/25 text-zinc-200 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-warning">Privacy notice:</strong> Application logs may contain sensitive data.
              Common secrets (API keys, JWTs, passwords, database credentials) are automatically redacted, and relevant
              evidence may be sent to the configured AI provider. Inspect the sanitized preview before submitting.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-muted block" htmlFor="custom-project-input">
                Application / project name
              </label>
              <input
                id="custom-project-input"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Checkout Platform"
                className="w-full bg-[#060908] border border-white/[0.1] rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-muted block" htmlFor="custom-title-input">
                Incident title *
              </label>
              <input
                id="custom-title-input"
                type="text"
                required
                value={incidentTitle}
                onChange={(e) => setIncidentTitle(e.target.value)}
                placeholder="e.g. Checkout 504 timeouts after deploy"
                className="w-full bg-[#060908] border border-white/[0.1] rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-muted block" htmlFor="custom-service-input">
                Affected service
              </label>
              <input
                id="custom-service-input"
                type="text"
                value={affectedService}
                onChange={(e) => setAffectedService(e.target.value)}
                placeholder="e.g. api-gateway, orders-api"
                className="w-full bg-[#060908] border border-white/[0.1] rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-muted block" htmlFor="custom-severity-select">
                Initial severity
              </label>
              <select
                id="custom-severity-select"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-[#060908] border border-white/[0.1] rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent"
              >
                <option value="UNKNOWN">UNKNOWN</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-muted block" htmlFor="custom-desc-input">
              Incident description (optional)
            </label>
            <input
              id="custom-desc-input"
              type="text"
              value={incidentDescription}
              onChange={(e) => setIncidentDescription(e.target.value)}
              placeholder="Briefly describe symptoms, timeline, or recent changes..."
              className="w-full bg-[#060908] border border-white/[0.1] rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          {/* Add Log Sources */}
          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#060908] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-foreground">Add log source (.log, .txt, .json, .jsonl)</span>
              <div className="flex items-center gap-2">
                <select
                  aria-label="Source label"
                  value={sourcePreset}
                  onChange={(e) => setSourcePreset(e.target.value)}
                  className="bg-[#0F1713] border border-white/[0.1] rounded-md px-2.5 py-1 text-foreground"
                >
                  {SOURCE_PRESETS.map((preset) => (
                    <option key={preset} value={preset}>
                      {preset}
                    </option>
                  ))}
                </select>
                {sourcePreset === "Custom service" && (
                  <input
                    type="text"
                    value={customSourceName}
                    onChange={(e) => setCustomSourceName(e.target.value)}
                    placeholder="Service name"
                    className="bg-[#0F1713] border border-white/[0.1] rounded-md px-2.5 py-1 text-foreground w-32"
                  />
                )}
              </div>
            </div>

            <textarea
              rows={4}
              value={pastedLogs}
              onChange={(e) => setPastedLogs(e.target.value)}
              placeholder="Paste log lines or JSONL entries here, or upload a file below..."
              className="w-full bg-[#0B110E] border border-white/[0.1] rounded-lg p-2.5 font-mono text-[11px] text-foreground placeholder:text-zinc-500 focus:outline-none focus:border-accent"
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] hover:border-accent/40 text-foreground cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-accent" />
                  <span>Upload log file</span>
                  <input
                    type="file"
                    accept=".log,.txt,.json,.jsonl"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleAddPastedSource}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] hover:border-accent/40 text-foreground transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-accent" />
                  <span>Add pasted source</span>
                </button>
              </div>

              {(pastedLogs.trim() || sources.length > 0) && (
                <button
                  type="button"
                  onClick={() => setShowSanitizedPreview((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-[11px] text-accent hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showSanitizedPreview ? "Hide sanitized preview" : "Preview sanitized logs"}</span>
                </button>
              )}
            </div>

            {showSanitizedPreview && (
              <div className="p-2.5 rounded-lg bg-[#0B110E] border border-accent/25 font-mono text-[11px] text-zinc-300 max-h-32 overflow-y-auto whitespace-pre-wrap">
                {previewSanitize(
                  [...sources.map((s) => `[${s.label}]\n${s.rawContent}`), pastedLogs]
                    .filter(Boolean)
                    .join("\n\n")
                )}
              </div>
            )}

            {sources.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                <div className="text-[11px] text-muted">Queued sources ({sources.length}):</div>
                {sources.map((src) => (
                  <div
                    key={src.id}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-[#0F1713] border border-white/[0.08]"
                  >
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-accent font-semibold">{src.label}</span>
                      <span className="text-muted">{src.filename}</span>
                      <span className="text-zinc-500">
                        ({src.rawContent.trim().split("\n").filter(Boolean).length} lines)
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${src.label}`}
                      onClick={() => setSources((prev) => prev.filter((s) => s.id !== src.id))}
                      className="text-muted hover:text-critical p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {errorMsg && (
            <div role="alert" className="p-2.5 rounded-lg bg-critical/10 border border-critical/30 text-critical">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-muted hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-accent text-[#050807] font-semibold hover:brightness-105 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Start Custom Investigation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
