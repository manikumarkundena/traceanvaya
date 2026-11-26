import React from "react";
import { Pause, Play, RotateCcw, StepBack, StepForward } from "lucide-react";
import { EvidenceItem } from "./types";

interface IncidentReplayProps {
  evidenceList: EvidenceItem[];
  replayIndex: number;
  isPlaying: boolean;
  onReplayIndexChange: (index: number) => void;
  onTogglePlay: () => void;
}

export function IncidentReplay({
  evidenceList,
  replayIndex,
  isPlaying,
  onReplayIndexChange,
  onTogglePlay,
}: IncidentReplayProps) {
  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 space-y-4 overflow-y-auto">
      <div className="p-4 rounded-xl border border-border bg-surface-elevated space-y-3">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-accent font-semibold flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Chronological Event Replay
          </span>
          <span className="text-muted">
            Step {replayIndex + 1} of {evidenceList.length}
          </span>
        </div>

        {/* Scrubber slider */}
        <input
          type="range"
          min="0"
          max={Math.max(0, evidenceList.length - 1)}
          value={replayIndex}
          onChange={(e) => onReplayIndexChange(Number(e.target.value))}
          className="w-full accent-accent cursor-pointer"
        />

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onReplayIndexChange(Math.max(0, replayIndex - 1))}
            className="p-2 rounded bg-surface hover:bg-border text-foreground transition-colors"
            title="Step backward"
          >
            <StepBack className="w-4 h-4" />
          </button>
          <button
            onClick={onTogglePlay}
            className="p-2.5 rounded-lg bg-accent text-background hover:bg-accent/90 transition-colors font-bold"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onReplayIndexChange(Math.min(evidenceList.length - 1, replayIndex + 1))}
            className="p-2 rounded bg-surface hover:bg-border text-foreground transition-colors"
            title="Step forward"
          >
            <StepForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Current Replayed Event Spotlight */}
      {evidenceList[replayIndex] && (
        <div className="p-4 rounded-xl border border-accent/40 bg-background font-mono text-xs space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="font-bold text-accent text-sm">
              {evidenceList[replayIndex].id}
            </span>
            <span className="text-muted text-[10px]">
              {evidenceList[replayIndex].timestamp}
            </span>
          </div>
          <div className="text-muted text-[11px]">
            Service: <span className="text-foreground">{evidenceList[replayIndex].service}</span> | Severity: <span className="text-critical">{evidenceList[replayIndex].severity}</span>
          </div>
          <div className="p-3 rounded bg-surface border border-border text-foreground text-[11px] leading-relaxed">
            {evidenceList[replayIndex].message}
          </div>
        </div>
      )}

      {/* Chronological List View */}
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-muted">
          Incident Timeline Progress
        </span>
        <div className="space-y-1.5 font-mono text-[11px]">
          {evidenceList.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => onReplayIndexChange(idx)}
              className={`p-2 rounded cursor-pointer transition-colors flex items-center justify-between ${
                idx === replayIndex
                  ? "bg-accent/20 border border-accent/40 text-foreground font-bold"
                  : idx < replayIndex
                  ? "text-muted hover:text-foreground"
                  : "text-muted/60 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-accent">{item.id}</span>
                <span className="truncate">{item.message}</span>
              </div>
              <span className="text-[10px] flex-shrink-0 ml-2">{item.timestamp.slice(11, 19)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
