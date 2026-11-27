"use client";

import React from "react";
import { Cpu, CheckCircle2, X, Lock } from "lucide-react";
import { ProviderCatalog } from "./types";

interface ProviderSettingsModalProps {
  isOpen: boolean;
  catalog: ProviderCatalog | null;
  onSelectProvider: (providerId: string) => Promise<void>;
  onClose: () => void;
}

export function ProviderSettingsModal({
  isOpen,
  catalog,
  onSelectProvider,
  onClose,
}: ProviderSettingsModalProps) {
  if (!isOpen) return null;

  const activeModeLabel =
    catalog?.mode === "live"
      ? "Live AI Inference"
      : catalog?.mode === "local_ollama"
      ? "Local Ollama Inference"
      : "Deterministic Demo Mode";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="AI provider settings"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="w-full max-w-lg rounded-2xl border border-white/[0.12] bg-[#0B110E] shadow-2xl overflow-hidden text-xs">
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0F1713]">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-foreground">AI Provider Configuration</h2>
          </div>
          <button
            type="button"
            aria-label="Close provider settings"
            onClick={onClose}
            className="p-1 rounded-md text-muted hover:text-foreground hover:bg-white/[0.06]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="p-3 rounded-lg bg-[#060908] border border-white/[0.08] flex items-center justify-between">
            <div>
              <div className="text-[11px] text-muted">Active session status</div>
              <div className="text-sm font-semibold text-foreground mt-0.5">{activeModeLabel}</div>
            </div>
            <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-accent/10 border border-accent/25 text-accent">
              {catalog?.active_model || "deterministic-demo"}
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-muted font-medium">Server-configured providers</div>
            {(catalog?.providers || []).map((p) => {
              const isActive = catalog?.active_provider === p.id;
              return (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl border transition-colors flex items-center justify-between gap-3 ${
                    isActive
                      ? "border-accent/40 bg-accent/5"
                      : "border-white/[0.08] bg-[#060908]"
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{p.label}</span>
                      <span className="font-mono text-[10px] text-muted">{p.model}</span>
                    </div>
                    <p className="text-[11px] text-muted leading-snug">{p.description}</p>
                  </div>

                  {p.configured ? (
                    <button
                      type="button"
                      disabled={isActive}
                      onClick={() => onSelectProvider(p.id)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 flex-shrink-0 ${
                        isActive
                          ? "bg-accent/15 text-accent border border-accent/30 cursor-default"
                          : "bg-white/[0.06] text-foreground hover:bg-white/[0.12] border border-white/[0.1]"
                      }`}
                    >
                      {isActive && <CheckCircle2 className="w-3 h-3" />}
                      <span>{isActive ? "Active" : "Use"}</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-[10px] text-zinc-500 flex-shrink-0">
                      <Lock className="w-3 h-3" />
                      Not configured
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-muted leading-relaxed">
            Provider credentials and local Ollama URLs are configured exclusively on the server via environment
            variables and are never exposed to browser storage.
          </p>
        </div>
      </div>
    </div>
  );
}
