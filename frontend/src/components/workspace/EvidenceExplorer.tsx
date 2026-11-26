import React from "react";
import { Search } from "lucide-react";
import { EvidenceItem } from "./types";

interface EvidenceExplorerProps {
  evidenceList: EvidenceItem[];
  searchQuery: string;
  severityFilter: string;
  selectedEvidence: EvidenceItem | null;
  onSearchChange: (query: string) => void;
  onSeverityChange: (severity: string) => void;
  onSelectEvidence: (item: EvidenceItem) => void;
  onCitationClick: (evidenceId: string) => void;
}

export function EvidenceExplorer({
  evidenceList,
  searchQuery,
  severityFilter,
  selectedEvidence,
  onSearchChange,
  onSeverityChange,
  onSelectEvidence,
  onCitationClick,
}: EvidenceExplorerProps) {
  const filtered = evidenceList.filter((item) => {
    const matchesSev = severityFilter === "ALL" || item.severity === severityFilter;
    const matchesQuery =
      !searchQuery ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesQuery;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Search & severity filters */}
      <div className="p-3 border-b border-white/[0.08] bg-surface-elevated space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search logs by ID, message, or service..."
            className="w-full bg-background border border-white/[0.1] rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-accent font-mono transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 text-[10px] font-mono overflow-x-auto">
          {["ALL", "CRITICAL", "ERROR", "WARN", "INFO"].map((sev) => (
            <button
              key={sev}
              onClick={() => onSeverityChange(sev)}
              className={`px-2 py-0.5 rounded transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                severityFilter === sev
                  ? "bg-accent text-background font-bold"
                  : "bg-surface border border-white/[0.08] text-muted hover:text-foreground"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence item list */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/[0.06]">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-muted">
            No matching evidence entries found.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectEvidence(item)}
              className={`p-3 text-xs font-mono cursor-pointer transition-colors ${
                selectedEvidence?.id === item.id
                  ? "bg-accent/10 border-l-2 border-accent"
                  : "hover:bg-surface-elevated/80"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-accent">{item.id}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      item.severity === "CRITICAL" || item.severity === "FATAL"
                        ? "bg-critical/20 text-critical"
                        : item.severity === "ERROR"
                        ? "bg-critical/15 text-critical"
                        : item.severity === "WARN"
                        ? "bg-warning/15 text-warning"
                        : "bg-info/15 text-info"
                    }`}
                  >
                    {item.severity}
                  </span>
                  <span className="text-[10px] text-muted">{item.service}</span>
                </div>
                <span className="text-[10px] text-muted">{item.timestamp.slice(11, 19)}</span>
              </div>
              <p className="text-foreground line-clamp-2 text-[11px] leading-relaxed">
                {item.message}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Selected Evidence Detail Drawer */}
      {selectedEvidence && (
        <div className="p-4 border-t border-white/[0.08] bg-surface-elevated max-h-56 overflow-y-auto font-mono text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-accent">{selectedEvidence.id} Detail</span>
            <span className="text-[10px] text-muted">{selectedEvidence.timestamp}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-background border border-white/[0.08] text-foreground break-all text-[11px]">
            {selectedEvidence.raw_log}
          </div>
          {selectedEvidence.correlated_ids.length > 0 && (
            <div className="text-[10px] text-muted flex items-center gap-1.5 flex-wrap">
              <span>Correlated Events:</span>
              {selectedEvidence.correlated_ids.map((cId) => (
                <button
                  key={cId}
                  onClick={() => onCitationClick(cId)}
                  className="bg-surface border border-white/[0.1] px-1.5 py-0.5 rounded text-foreground hover:bg-accent/20 hover:text-accent transition-colors"
                >
                  {cId}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
